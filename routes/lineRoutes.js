var express = require('express');
var router = express.Router();
var lineService = require('../Controllers/lineService');

/**
 * this post request will call routeService addRoute method
 */
router.post('/', (req, res) => {
    lineService.addRoute(req.body, req.headers).then(data => {
        res.status(data.status).send({success: data.success, message: data.message});
    }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message});
    });
});

/**
 * this get request show all lines
 */
router.get('/', (req, res) => {
    lineService.getAll().then(data => {
        res.status(data.status).send({success: data.success, line: data.line});
    }).catch(err => {
        res.status(err.status).send({success: err.success, line: err.line});
    });
});
/**
 * this get request show all lines
 */
router.get('/:line', (req, res) => {
    lineService.getInfoByLine(req.params.line).then(data => {
        res.status(data.status).send({success: data.success, line: data.line});
    }).catch(err => {
        res.status(err.status).send({success: err.success, line: err.line});
    });
});

/**
 * this put request will update route information
 *
 */
router.put('/:id', (req, res) => {
    lineService.updateInfo(req.params.id, req.body, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message})
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});
/**
 * this delete request will delete line resource
 *
 */
router.delete('/:id', (req, res) => {
    lineService.deleteLine(req.params.id, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message})
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});

module.exports = router;