const express = require('express');
const router = express.Router();

const controllerOrder = require('../controllers/order');
const controllerShipment = require('../controllers/shipment');

const middleware = require('./myMiddleware');

// ---------------------------------------------

// GET Order Info
router.get(
    '/:id',
    middleware.expandExtractor,
    middleware.fieldSelector,
    function (req, res, next) {
        controllerOrder
            .getOrderInfo(req.params.id, req.expand || '')
            .then((info) => {
                res.jsonp(info);
            })
            .catch((error) => {
                res.jsonp(error);
            });
    }
);

// POST Order Info
router.post('/', function (req, res, next) {
    //add _client to shipments
    req.body.shipments.forEach((shipment) => {
        shipment._client = req.body._client;
    });
    //Create the shipments and then the order with their ids
    controllerShipment
        .createManyShipments(req.body.shipments)
        .then((shipments) => {
            let order = req.body;
            order.shipments = shipments.map((shipment) => shipment._id);
            controllerOrder
                .createOrder(order)
                .then((info) => {
                    res.jsonp(info);
                })
                .catch((error) => {
                    res.jsonp(error);
                });
        });
});

// PUT Order Info
router.put('/:id', function (req, res, next) {
    controllerOrder
        .replaceOrderInfo(req.params.id, req.body)
        .then((info) => {
            res.jsonp(info);
        })
        .catch((error) => {
            res.jsonp(error);
        });
});

// PATCH Order Info
router.patch('/:id', function (req, res, next) {
    controllerOrder
        .updateOrderInfo(req.params.id, req.body)
        .then((info) => {
            res.jsonp(info);
        })
        .catch((error) => {
            res.jsonp(error);
        });
});

// DELETE Order Info
router.delete('/:id', function (req, res, next) {
    controllerOrder
        .deleteOrder(req.params.id)
        .then((info) => {
            res.jsonp(info);
        })
        .catch((error) => {
            res.jsonp(error);
        });
});

// GET Orders
router.get(
    '/',
    middleware.expandExtractor,
    middleware.extractFilters,
    middleware.fieldSelector,
    function (req, res, next) {
        controllerOrder
            .getOrders(
                req.filters,
                req.fields,
                req.query.page || 0,
                req.query.limit || 28,
                req.expand || ''
            )
            .then((info) => {
                res.jsonp(info);
            })
            .catch((error) => {
                res.jsonp(error);
            });
    }
);

module.exports = router;
