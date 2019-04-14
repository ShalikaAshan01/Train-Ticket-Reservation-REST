"use strict";
const user = require('../Models/userModel');
//require bcrypt for encrypt password and payment info
const bcrypt = require('bcrypt');

const userService = function () {
};
//create new user
userService.signup = function (data) {
    return new Promise(function (resolve, reject) {
        const userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            nic: data.nic,
            email: data.email,
            telephoneNumber: data.telephoneNumber
        };

        //find user with given nic,in this method one nic can create only one account
        user.findOne({
            nic: data.nic
        })
            .then(res => {

                //check if res if true or false if it's true it means already user account created under given nic
                if (!res) {
                    //encrypt password
                    bcrypt.hash(data.password,12,(err,hash)=>{
                        userData.password = hash;
                        //create new collection
                        user.create(userData)
                            .then(() => {
                                resolve({status: 200, message: "Successfully Registered", success: true})
                            })
                            .catch((err) => {
                                reject({status: 500, error: "Error: " + err})
                            });
                    });
                } else {
                    resolve({status: 200, message: "Someone already registered under this nic", success: false})
                }
            })
            .catch((err) => {
                reject({status: 500, error: "Error: " + err})
            });
    })
};
/**
 * user signin with given credential
 * @param data
 */
userService.signin = function (data){
    return new Promise(function (resolve, reject) {
        //find user by given nic
        user.findOne({nic:data.nic})
            .then((user)=>{
                if(user){
                    //compare encrypted passwords
                    if(bcrypt.compareSync(data.password,user.password)){
                        const payload = {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            nic: user.nic,
                            telephoneNumber: user.telephoneNumber,
                            type: user.type,
                        };
                        resolve({status: 200,user:payload, message: "Successfully logged in", success: true})
                    }else{
                        resolve({status: 200,user:null, message: "Combination of NIC and Password doesn't match", success: false})
                    }
                }else{
                    resolve({status: 200, message: "Combination of NIC and Password doesn't match", success: false})
                }
            })
            .catch((err) => {
                reject({status: 500, error: "Error: " + err})
        });
    });
};
/**
 * this method will return user information
 * @param id
 */
userService.showProfle = function(nic){
    return new Promise(function (resolve, reject) {
        //find user by given nic
       user.findOne({nic:nic}).then((user)=>{
           if(user){
               //if user found with given nic
               user = JSON.parse(JSON.stringify(user));
               //remove unwanted elements from user object
               delete user.password;
               delete user.__v;
               resolve({status:200,success:true,user:user})
           }else{
               resolve({status:404,success:false,user:user})
           }
       }).catch(err=>{
          reject({status:500,message: err })
       });
    });
};
module.exports = userService;