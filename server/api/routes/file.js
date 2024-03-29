const express = require('express');
const router = express.Router();
const controllerFile = require('../controllers/file');

router.get('/:filename', function (req, res, next) {
    controllerFile
        .getFile(req.params.filename)
        .then((info) => {
            res.header('Content-Type', info.mimetype);
            res.header('Content-Length', info.size);
            res.status(200).send(info.data);
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

module.exports = router;
