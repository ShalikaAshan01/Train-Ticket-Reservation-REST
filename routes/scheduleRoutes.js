var express = require('express');
var router = express.Router();
var scheduleService = require('../Controllers/scheduleService');

router.post('/', (req, res) => {
    scheduleService.createSchedule(req.body)
        .then(data => {
            res.status(data.status).send({message: data.message, success: data.success})
        }).catch(err => {
        res.status(err.status).send({message: err.message})
    })
});

module.exports = router;