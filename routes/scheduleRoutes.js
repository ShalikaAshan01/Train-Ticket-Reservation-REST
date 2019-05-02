var express = require('express');
var router = express.Router();
var scheduleService = require('../Controllers/scheduleService');

/**
 * this post method will create new schedule
 */
router.post('/', (req, res) => {
    scheduleService.createSchedule(req.body)
        .then(data => {
            res.status(data.status).send({message: data.message, schedule: data.data, success: data.success})
        }).catch(err => {
        res.status(err.status).send({message: err.message})
    })
});

/**
 * this get method will return schedule information by schedule date and Train id
 */
router.get('/:scheduleDate/:_tid', (req, res) => {
    scheduleService.showScheduleByDateAndTID(req.params)
        .then(data => {
            res.status(data.status).send({schedule: data.schedule, message: data.message, success: data.success})
        }).catch(err => {
        res.status(err.status).send({schedule: err.schedule, message: err.message, success: err.success})
    })
});

/**
 * this put method will update reservation object
 */
router.put('/:id/:date', (req, res) => {
    scheduleService.makeReservation(req.params.date, req.params.id, req.body, req.headers)
        .then(data => {
            res.status(data.status).send({message: data.message, success: data.success})
        }).catch(err => {
        res.status(err.status).send({message: err.message, success: err.success})
    })
});
/**
 * this get method will show all reservation by id
 */
router.get('/:id', (req, res) => {
    scheduleService.getReservationByID(req.params.id)
        .then(data => {
            res.status(data.status).send({reservation: data.reservation, message: data.message})
        }).catch(err => {
        res.status(err.status).send({reservation: err.reservation, message: err.message})
    })
});

module.exports = router;