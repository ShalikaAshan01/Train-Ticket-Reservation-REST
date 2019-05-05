var express = require('express');
var router = express.Router();
var userController = require('../Controllers/userService');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//this post request will call the signup function in userService
router.post('/signup', (req, res) => {
    if (!req.body) res.status(400);
    userController.signup(req.body)
        .then(function (data) {
            res.status(data.status).send({message: data.message, success: data.success});
        })
        .catch(err => {
            res.status(err.status).send({message: err.message});
        });
});
//this post request will call the signin function in userService
router.post('/signin', (req, res) => {
    userController.signin(req.body)
        .then(function (data) {
            res.status(data.status).send({
                user: data.user,
                token: data.token,
                message: data.message,
                success: data.success
            });
        })
        .catch(err => {
            res.status(err.status).send({message: err.message});
        });
});
//this post request will call the showProfile function in userService which handle user profile api request
router.get('/:id', (req, res) => {
    userController.showProfle(req.params.id)
        .then(data => {
            res.status(data.status).send({success: data.success, user: data.user});
        }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});
router.put('/:nic/paymentmethod', (req, res) => {
    res.status(501).send({message: "Not Implemented"})
});
/**
 * in this put method will update user information
 */
router.patch('/:id', (req, res) => {
    userController.updateProfile(req.params.id, req.body, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message, user: data.user}
            )
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});
/**
 * this put method will change user password
 *
 */
router.put('/:id/changepassword', (req, res) => {
    userController.updatePassword(req.params.id, req.body, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message});
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});

router.post('/:id/:token', (req, res) => {
    userController.validateUser(req.params.id, req.params.token)
        .then(data => {
            res.status(data.status).send({success: data.success, role: data.role})
        }).catch(err => {
        res.status(err.status).send({success: err.success, role: err.role})
    })
});
module.exports = router;