var secrets = require('docker-secret').secrets;

const Orders = require('../controllers/order');
const Products = require('../controllers/product');
const Shipments = require('../controllers/shipment');
const paypalBaseUrl = secrets.PAYPAL_ENVIRONMENT == "sandbox" 
    ? secrets.PAYPAL_SANDBOX_URL
    : secrets.PAYPAL_LIVE_URL;

// ***************************************
// *              PayPal                 *
// ***************************************

/**
* Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
* @see https://developer.paypal.com/api/rest/authentication/
*/
const generatePaypalAccessToken = async function() {
    try {
        if (!secrets.PAYPAL_CLIENT_ID || !secrets.PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            secrets.PAYPAL_CLIENT_ID + ":" + secrets.PAYPAL_CLIENT_SECRET,
        ).toString("base64");
        const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.log("Failed to generate Access Token:", error);
    }
};

/**
* Create an order to start the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/
module.exports.createPaypalOrder = async function(data) {
    // use the cart information passed from the front-end to calculate the purchase unit details
    if (data.cart && Array.isArray(data.cart)) {
        let tmpValue = 0;
        for (const item of data.cart) {
            try {
                const product = await Products.getProductInfo(item._product);
                const value = await product.price;
                tmpValue += value * item.amount;
            } catch (error) {
                throw new Error("Error getting product prices: " + error);
            }
        }
        let percentage = data.reservation == true ? 0.25 : 0.75;
        let cartValue = (Math.round(tmpValue * percentage * 100) / 100).toFixed(2);
        console.log("Total cart value: " + cartValue);

        try {
            const accessToken = await generatePaypalAccessToken();
            const url = `${paypalBaseUrl}/v2/checkout/orders`;
            const payload = {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: data.currency, // 'EUR'
                            value: cartValue,
                        },
                    },
                ],
            };

            const response = await fetch(url, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
                        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
                        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
                    },
                    method: "POST",
                    body: JSON.stringify(payload),
                });

            return handleCreateOrderResponse(response, data);
        } catch (err) {
            throw new Error("Error on request to Paypal: ", err);
        }
    } else {
        throw new Error("Error: Empty or invalid cart");
    }
};

/**
* Capture payment for the created order to complete the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
*/
module.exports.capturePaypalOrder = async function(paypalOrderId) {
    try {
        const accessToken = await generatePaypalAccessToken();
        const url = `${paypalBaseUrl}/v2/checkout/orders/${paypalOrderId}/capture`;
        
        const response = await fetch(url, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                    // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                    // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
                    // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
                    // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
                },
            });
    
        return handleCaptureOrderResponse(response);
    } catch (err) {
        throw err;
    }
};

async function handleCreateOrderResponse(response, data) {
    try {
        var jsonResponse = await response.json();
        var status = response.status;
        if (200 <= status <= 299) {
            try {
                if (data.reservation) {
                    await Orders.createOrderWithShipments({
                        shipments: data.shipments.map(shipment => ({
                            ...shipment,
                            "states": [{}],
                            payments: [
                                {
                                    transactionId: jsonResponse.id,
                                    method: "paypal"
                                }
                            ]
                        })),
                        "_client": data._client
                    });
                } else {
                    for(const element of data.cart) {
                        await Shipments.addPaymentInfo(
                            { _product: element._product }, 
                            { 
                                transactionId: jsonResponse.id, 
                                method: 'paypal'
                            }
                        );
                    }
                }
            } catch (error) {
                status = 500;
                jsonResponse = { "error": "Could not create Paypal order" };
            }
        }
        return {
            jsonResponse,
            httpStatusCode: status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

async function handleCaptureOrderResponse(response) {
    try {
        var jsonResponse = await response.json();
        console.log(jsonResponse);
        const shipmentsArray = await Shipments.getShipments(
            {"payments.transactionId": jsonResponse.id}, 
            {}, 0, 0, '');
        console.log("Shipments=", shipmentsArray);
        for (const shipment of shipmentsArray.results) {
            console.log("ShipmentId=", shipment._id);
            const len = shipment.states.length - 1;
            const oldState = shipment.states[len];
            if (oldState.value != 'unpaid' && oldState.value != 'reserved') {
                return {
                    httpStatusCode: 500,
                    jsonResponse: {
                        errorMessage: "Order state is invalid, can no alter state"
                    },
                };
            }
            const updatedState = oldState.value == 'unpaid' ? 'pending' : 'paid';
    
            await Shipments.updateShipmentState({ '_id': shipment._id }, updatedState);
        }
        return {
            httpStatusCode: 200,
            jsonResponse: {
                message: "Processed capture order successfully!",
                transactionId: orderId,
            },
        };
    } catch {
        return {
            httpStatusCode: 500,
            jsonResponse: {
                errorMessage: "Could not process get order's shipments"
            },
        };
    }
}