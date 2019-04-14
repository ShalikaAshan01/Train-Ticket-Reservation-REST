var express = require('express');
var router = express.Router();
var trainController = require('../Controllers/trainService');

/**
 * this post method will called addNewTrain method which add new train information
 */
router.post('/', (req, res) => {
    trainController.addNewTrain(req.body, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message});
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message});
    });
});


module.exports = router;