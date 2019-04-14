"use strict";
const user = require('../Models/userModel');
//require bcrypt for encrypt password and payment info
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');

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
 * this method will create new token value and update database
 * @param id
 */
async function updateToken(id) {
    //generate random token value
    const buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(256, function (ex, buffer) {
            if (ex) {
                reject("error generating token");
            }
            resolve(buffer);
        });
    });
    const token = crypto
        .createHash("sha1")
        .update(buffer)
        .digest("hex");

    var tokenData = {
        _token: token,
        date: moment().format('D/M/YYYY, HH:mm:ss')
    };
    tokenData = {
        _token: tokenData
    };

    //update database
    var query = {'_id': id};
    user.findOneAndUpdate(query, {$set: tokenData}, {upsert: false}, function (err, doc) {
    });
    return token;
}
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
                            role: user.role,
                        };

                        //change token
                        updateToken(user._id).then(token => {
                            payload._token = token;
                            resolve({status: 200, user: payload, message: "Successfully logged in", success: true})
                        });
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
/**
 * this method will update user's payment information
 * @param nic
 * @param info
 */
// userService.updatePaymentInfo = function(nic,info,method){
//     return new Promise(function (resolve, reject) {
//         if(method==="cc"){
//             var payinfo={
//                 type:info.cardtype,
//                 csv:csv,
//                 number:cardnumber,
//                 month:month,
//                 year:year
//             };
//             user.findOneAndDelete({nic:nic},{$set:payinfo},{upsert:false},function (err,doc) {
//
//             });
//         }else if(method ==="mobile"){
//
//         }else if(method==="remove"){
//
//         }
//     });
// };
/**
 * in this method will update user informations
 * @param nic
 * @param data
 * @param header
 */
userService.updateProfile = function (nic, data, header) {
    const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        telephoneNumber: data.telephoneNumber,
        updatedAt: moment()
    };
    return new Promise(function (resolve, reject) {
        //if user token invalid reject the request
        userService.isLoggedUser(header._token, header._id).then(res => {
            if (!res.isLogged) {
                reject({status: 401, message: "Please sign in before update profile", success: false});
            } else {
                user.findOneAndUpdate({nic: nic}, {$set: userData}, {upsert: false}, function (err, doc) {
                    if (err)
                        reject({status: 500, message: err, success: false});
                    if (doc)
                        resolve({status: 200, message: "successfully updated", success: true});
                    else
                        resolve({status: 200, message: "Cannot find entity", success: false})
                })
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before update profile", success: false});
        });
    });
};

/**
 * validate logged user token
 * @returns {boolean}
 */
userService.isLoggedUser = async function (token, id) {
    const u = await new Promise((resolve, reject) => {
        user.findById(id, function (err, user) {
            if (err)
                reject(err);
            resolve(user);
        });
    });
    if (u == null)
        return {isLogged: false, type: null};
    else if (token === u._token._token) {
        return {isLogged: true, type: u.role};
    } else {
        return {isLogged: false, type: null};
    }
}

/**
 * this method will change user password
 * @param nic
 * @param password
 * @param header
 * @returns {Promise<any>}
 */
userService.updatePassword = function (nic, password, header) {
    return new Promise(function (resolve, reject) {

        //if user token invalid reject the request
        userService.isLoggedUser(header._token, header._id).then(res => {
            if (!res.isLogged)
                reject({status: 401, message: "Please sign in before update password", success: false});
            else {
                bcrypt.hash(password, 12, (err, hash) => {
                    var userData = {password: hash, updatedAt: moment()};

                    //update password
                    user.findOneAndUpdate({nic: nic}, {$set: userData}, {upsert: false}, function (err, doc) {
                        if (err)
                            reject({status: 500, message: err, success: false});
                        if (doc)
                            resolve({status: 200, message: "Password changed", success: true});
                        else
                            resolve({status: 200, message: "Cannot find user", success: false})
                    });
                });
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before update password", success: false});
        });
    })
};
module.exports = userService;