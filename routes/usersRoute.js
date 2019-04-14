var express = require('express');
var router = express.Router();
var userController = require('../Controllers/userService');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//this post request will call the signup function in userService
router.post('/signup', (req, res) => {
  userController.signup(req.body)
      .then(function(data){
        res.status(data.status).send({message: data.message,success:data.success});
      })
      .catch(err => {
        res.status(err.status).send({message: err.message});
      });
});
//this post request will call the signin function in userService
router.post('/signin',(req,res)=>{
  userController.signin(req.body)
      .then(function (data) {
        res.status(data.status).send({user:data.user,message: data.message,success:data.success});
      })
      .catch(err=>{
        res.status(err.status).send({message: err.message});
      });
});
//this post request will call the showProfile function in userService which handle user profile api request
router.get('/:nic',(req,res)=>{
    userController.showProfle(req.params.nic)
        .then(data=>{
          res.status(data.status).send({success:data.success,user:data.user});
        }).catch(err=>{
          res.status(err.status).send({message: err.message});
    });
});
router.put('/:nic/paymentmethod',(req,res)=>{
    res.status(501).send({message: "Not Implemented"})
});
/**
 * in this put method will update user information
 */
router.put('/:nic', (req, res) => {
    userController.updateProfile(req.params.nic, req.body, req.headers)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message})
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});
/**
 * this put method will change user password
 *
 */
router.put('/:nic/changepassword', (req, res) => {
    userController.updatePassword(req.params.nic, req.body.password)
        .then(data => {
            res.status(data.status).send({success: data.success, message: data.message});
        }).catch(err => {
        res.status(err.status).send({success: err.success, message: err.message})
    });
});
module.exports = router;