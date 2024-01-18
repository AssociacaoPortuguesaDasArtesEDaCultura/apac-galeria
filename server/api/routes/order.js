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
    //Create the shipments and then the order with their ids
    controllerOrder
        .createOrderWithShipments(req.body)
        .then((info) => {
            res.status(201).jsonp(info);
        })
        .catch((error) => {
            res.status(500).jsonp(error);
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
