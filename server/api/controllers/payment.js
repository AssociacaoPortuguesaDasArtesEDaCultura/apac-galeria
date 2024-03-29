var secrets = require('docker-secret').secrets;

const Orders = require('../controllers/order');
const Products = require('../controllers/product');
const Shipments = require('../controllers/shipment');
const Users = require('../controllers/user');
const paypalBaseUrl = secrets.PAYPAL_ENVIRONMENT == "sandbox" 
    ? secrets.PAYPAL_SANDBOX_URL
    : secrets.PAYPAL_LIVE_URL;
    const eupagoBaseUrl = secrets.EUPAGO_ENVIRONMENT == "sandbox" 
    ? secrets.EUPAGO_SANDBOX_URL
    : secrets.EUPAGO_LIVE_URL;

// ***************************************
// *               EuPago                *
// ***************************************

module.exports.createEuPagoMBWayOrder = async function(data) {
    if (data.cart && Array.isArray(data.cart)) {
        const cartValue = await calcOrderPrice(data);

        try {
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  Authorization: `ApiKey ${secrets.EUPAGO_API_KEY}`
                },
                body: JSON.stringify({
                    payment: {
                        amount: {
                            currency: data.currency, 
                            value: cartValue
                        },
                        identifier: data.identifier,
                        customerPhone: data.customer.phone,
                        countryCode: data.customer.countryCode
                    }
                })
            };
            const response = await fetch(`${eupagoBaseUrl}/api/v1.02/mbway/create`, options);
            return handleEuPagoResponse(response, data);      
        } catch (err) {
            throw err;
        }
    } else {
        throw new Error("Error: Empty or invalid cart");
    }
}

module.exports.createEuPagoCreditCardOrder = async function(data) {
    if (data.cart && Array.isArray(data.cart)) {
        const cartValue = await calcOrderPrice(data);

        try {
            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `ApiKey ${secrets.EUPAGO_API_KEY}`
                },
                body: JSON.stringify({
                    payment: {
                        amount: {
                            currency: data.currency, 
                            value: cartValue
                        },
                        lang: data.lang, // 'PT'
                        identifier: data.identifier,
                        successUrl: data.successUrl,
                        failUrl: data.failUrl,
                        backUrl: data.backUrl
                    },
                    customer: {
                        notify: data.customer.notify,
                        email: data.customer.email
                    }
                })
            };

            const response = await fetch(`${eupagoBaseUrl}/api/v1.02/creditcard/create`, options);
            return handleEuPagoResponse(response, data);
        } catch (err) {
            throw err;
        }
    } else {
        throw new Error("Error: Empty or invalid cart");
    }
}

module.exports.receiveEuPagoWebhook = async function(data) {
    try {
        const shipmentsArray = await Shipments.getShipments(
            {"payments.transactionId": data.transactionId}, 
            {}, 0, 0, '');
        for (const shipment of shipmentsArray.results) {
            const len = shipment.states.length - 1;
            const oldState = shipment.states[len];
            if (oldState.value != 'unpaid' && oldState.value != 'reserved') {
                return {
                    httpStatusCode: 500,
                    jsonResponse: {
                        errorMessage: "Could not process webhook"
                    },
                };
            }
            const updatedState = oldState.value == 'unpaid' ? 'pending' : 'paid';
    
            await Shipments.updateShipmentState({ '_id': shipment._id }, updatedState);
        }
        return {
            httpStatusCode: 200,
            jsonResponse: {
                message: "Processed EuPago webhook successfully!",
                transactionId: data.transactionId,
            },
        };
    } catch {
        return {
            httpStatusCode: 500,
            jsonResponse: {
                errorMessage: "Could not process webhook"
            },
        };
    }
}

async function handleEuPagoResponse(response, data) {
    try {
        var jsonResponse = await response.json();
        var status = jsonResponse.transactionStatus == "Success"
            ? 200
            : 401
        if (status == 200) {
            try {
                if (data.reservation) {
                    await Orders.createOrderWithShipments({
                        shipments: data.shipments.map(shipment => ({
                            ...shipment,
                            "states": [{}],
                            payments: [
                                {
                                    transactionId: jsonResponse.transactionID,
                                    method: "eupago",
                                    reference: jsonResponse.reference
                                }
                            ],
                            address: data.address
                        })),
                        "_client": data._client
                    });
                } else {
                    for(const element of data.cart) {
                        await Shipments.addPaymentInfo(
                            { _product: element._product },
                            {
                                transactionId: jsonResponse.transactionID,
                                method: 'eupago',
                                reference: jsonResponse.reference
                            }
                        );
                    }
                }
            } catch (error) {
                status = 500;
                jsonResponse = { "error": "Could not create EuPago order" };
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

//const generateEuPagoBearerToken = async function() {
//    if (!secrets.EUPAGO_CLIENT_ID || !secrets.EUPAGO_CLIENT_SECRET) {
//        throw new Error("MISSING_API_CREDENTIALS");
//    }
//
//    const options = {
//        method: 'POST',
//        headers: {
//            accept: 'application/json',
//            'content-type': 'application/json'
//        },
//        body: JSON.stringify({
//            grant_type: 'client_credentials',
//            client_id: secrets.EUPAGO_CLIENT_ID,
//            client_secret: secrets.EUPAGO_CLIENT_SECRET,
//            username: secrets.EUPAGO_USERNAME,
//            password: secrets.EUPAGO_PASSWORD
//        })
//    };
//    try {
//        const res = await fetch('https://sandbox.eupago.pt/api/auth/token', options);
//        const data = await res.json();
//        console.log(data)
//        return data.access_token;
//    } catch (error) {
//        console.log("Failed to generate Access Token:", error);
//    }
//}

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
        //throw error;
    }
};

/**
* Create an order to start the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/
module.exports.createPaypalOrder = async function(data) {
    // use the cart information passed from the front-end to calculate the purchase unit details
    if (data.cart && Array.isArray(data.cart)) {
        const cartValue = await calcOrderPrice(data);

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
                }
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
                            ],
                            address: data.address
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
        throw err;
    }
}

async function handleCaptureOrderResponse(response) {
    try {
        var jsonResponse = await response.json();
        const shipmentsArray = await Shipments.getShipments(
            {"payments.transactionId": jsonResponse.id}, 
            {}, 0, 0, '');
        for (const shipment of shipmentsArray.results) {
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
                transactionId: jsonResponse.id,
                ...jsonResponse,
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

async function calcOrderPrice(data) {
    let tmpValue = 0;
    let percentage = data.reservation == true ? 0.25 : 0.75;
    for (const item of data.cart) {
        try {
            const product = await Products.getProductInfo(item._product);
            const shipmentFee = await calcShipmentFee(product, data.address);
            const value = product.price;
            tmpValue += value * item.amount * percentage;
            if (data.reservation == false) tmpValue += shipmentFee;
        } catch (error) {
            throw new Error("Error calculating prices: " + error);
        }
    }
    let cartValue = (Math.round(tmpValue * 100) / 100).toFixed(2);
    return cartValue;
} 

async function calcShipmentFee(product, address) {
    try {
        const clientAddress = address.postal_code[0];
        const seller = await Users.getUserInfo(product._seller);
        const sellerAddress = seller.seller_fields.demographics.address.postal_code[0];
        var type = await getShipmentType(clientAddress, sellerAddress); // is T1 (true) or T2 (false)
        var weight = product.piece_info.dimensions.weight;
        var shipmentFee = -1;

        if (weight <= 2) shipmentFee = type ? 9.05 : 10.15;
        else if (weight <= 5) shipmentFee = type ? 10.90 : 12.20;
        else if (weight <= 10) shipmentFee = type ? 15.30 : 16.90;
        else throw new Error("Product is too heavy to ship");

        return shipmentFee;
    } catch (error) {
        throw error;
    }
}

async function getShipmentType(a1, a2) {
    const table = [
        [true, true, true, true, false, false, false, false, ''],
        [true, true, true, true, false, true, true,	false, ''],
        [true, true, true, true, true, true, false,	false, ''],
        [true, true, true, true, true, false, false, false, ''],
        [false, false, true, true, true, true, false, false, ''],
        [false, true, true, false, true, true, true, false, ''],
        [false, true, false, false, false, true, true, true, ''],
        [false, false, false, false, false, false, true, true, ''],
        ['', '', '', '', '', '', '', '', true],
    ];

    if ((a1 == '9' && a2 != '9') || (a2 == '9' && a1 != '9')) {
        throw new Error("Invalid shipment locations");
    }
    return table[a1 - 1][a2 - 1];
}