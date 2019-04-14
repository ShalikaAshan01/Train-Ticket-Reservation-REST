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
  console.log(req.params.nic);
    userController.showProfle(req.params.nic)
        .then(data=>{
          res.status(data.status).send({success:data.success,user:data.user});
        }).catch(err=>{
          res.status(err.status).send({message: err.message});
    });
});
router.put('/:nic/paymentmethod',(req,res)=>{
  console.log(req.params.nic);
});
module.exports = router;
