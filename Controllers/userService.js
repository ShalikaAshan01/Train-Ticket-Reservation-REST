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
            email: data.email,
            telephoneNumber: data.telephoneNumber
        };
        //find user by email
        user.findOne({email: data.email})
            .then(res => {
                if (!res) {
                    //encrypt password
                    bcrypt.hash(data.password, 12, (err, hash) => {
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
                    resolve({status: 200, message: "Someone already registered under this email", success: false})
                }
            }).catch(err => {
            reject({status: 500, message: err, success: false});
        });
    })
};

/**
 * this method will create new token value and update database
 * @param id
 * @param token
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
userService.signin = function (data) {
    return new Promise(function (resolve, reject) {
        //find user by given email
        user.findOne({email: data.email})
            .then((user) => {
                if (user) {
                    //compare encrypted passwords
                    if (bcrypt.compareSync(data.password, user.password)) {
                        const payload = {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            telephoneNumber: user.telephoneNumber,
                            role: user.role,
                        };

                        //change token
                        updateToken(user._id).then(token => {
                            payload._token = token;
                            resolve({status: 200, user: payload, message: "Successfully logged in", success: true})
                        });
                    } else {
                        resolve({
                            status: 200,
                            user: null,
                            message: "Combination of email address and Password doesn't match",
                            success: false
                        })
                    }
                } else {
                    resolve({
                        status: 200,
                        message: "Combination of Email Address and Password doesn't match",
                        success: false
                    })
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
userService.showProfle = function (id) {
    return new Promise(function (resolve, reject) {
        //find user by given id
        user.findOne({_id: id}).then((user) => {
            if (user) {
                //if user found with given id
                user = JSON.parse(JSON.stringify(user));
                //remove unwanted elements from user object
                delete user.password;
                delete user.__v;
                resolve({status: 200, success: true, user: user})
            } else {
                resolve({status: 404, success: false, user: user})
            }
        }).catch(err => {
            reject({status: 500, message: err})
        });
    });
};
/**
 * this method will update user's payment information
 * @param id
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
 * @param id
 * @param data
 * @param header
 */
userService.updateProfile = function (id, data, header) {
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
                user.findOneAndUpdate({_id: id}, {$set: userData}, {upsert: false}, function (err, doc) {
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
 * @param id
 * @param password
 * @param header
 * @returns {Promise<any>}
 */
userService.updatePassword = function (id, password, header) {
    return new Promise(function (resolve, reject) {

        //if user token invalid reject the request
        userService.isLoggedUser(header._token, header._id).then(res => {
            if (!res.isLogged)
                reject({status: 401, message: "Please sign in before update password", success: false});
            else {
                bcrypt.hash(password, 12, (err, hash) => {
                    var userData = {password: hash, updatedAt: moment()};

                    //update password
                    user.findOneAndUpdate({_id: id}, {$set: userData}, {upsert: false}, function (err, doc) {
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
    });
};

/**
 * in this method will walidate user token and id
 * @param id
 * @param token
 * @returns {Promise<any>}
 */
userService.validateUser = function (id, token) {
    return new Promise(function (resolve, reject) {
        user.findOne({_id: id}).then(res => {
            if (res) {
                if (token === res._token._token)
                    resolve({status: 200, success: true});
                else
                    resolve({status: 400, success: false});
            } else
                resolve({status: 400, success: false});
        }).catch(err => {
            reject({status: 500, success: false})
        });
    });
};

module.exports = userService;