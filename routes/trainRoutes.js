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
/**
 * this patch method can update train information
 */
router.patch('/:id', (req, res) => {
    trainController.updateTrainInfo(req.params.id, req.body, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message})
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});
/**
 * get all train information
 */
router.get('/', (req, res) => {
    trainController.getTrains().then(data => {
        res.status(data.status).send({train: data.trains})
    }).catch(err => {
        res.status(err.status).send({train: err.trains})
    })
});
/**
 * get train information by id
 */
router.get('/:id', (req, res) => {
    trainController.getTrainByID(req.params.id).then(data => {
        res.status(data.status).send({trains: data.trains})
    }).catch(err => {
        res.status(err.status).send({trains: err.trains})
    })
});

/**
 * this method will return train availability
 */
router.get('/check/availability', ((req, res) => {
    trainController.checkAvailability(req.query).then(data => {
        res.status(data.status).send({trains: data.trains})
    }).catch(err => {
        res.status(err.status).send({trains: err.trains})
    })
}));

module.exports = router;