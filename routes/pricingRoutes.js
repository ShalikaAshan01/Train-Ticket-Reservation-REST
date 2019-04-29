var express = require('express');
var router = express.Router();
var pricingService = require('../Controllers/pricingService');

router.post('/', (req, res) => {
    pricingService.add(req.body)
        .then(data => {
            res.status(data.status).send({message: data.message, success: data.success})
        }).catch(err => {
        res.status(err.status).send({message: err.message, success: err.success})
    })
});

router.get('/:type', (req, res) => {
    console.log(req.params.type);
    pricingService.getByType(req.params.type)
        .then(data => {
            res.status(data.status).send({price: data.price, success: data.success})
        }).catch(err => {
        res.status(err.status).send({price: err.price, success: err.success})
    })
});

module.exports = router;