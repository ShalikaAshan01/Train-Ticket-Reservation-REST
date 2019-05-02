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
    pricingService.getByType(req.params.type)
        .then(data => {
            res.status(data.status).send({price: data.price, success: data.success})
        }).catch(err => {
        res.status(err.status).send({price: err.price, success: err.success})
    })
});

router.get('/discounts/:nic', (req, res) => {
    if (req.params.nic === "123456789v") {
        res.status(200).send({discount: 5, success: true, message: "Discount gained"})
    } else {
        res.status(200).send({
            discount: 0,
            success: false,
            message: "This nic number is not belong to government employee"
        })
    }

});

module.exports = router;