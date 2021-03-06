const train = require('../Models/trainModel');
const moment = require('moment');
const userService = require('../Controllers/userService');

const trainService = function () {
};
/**
 * in this method will add new train informations
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
trainService.addNewTrain = function (data, header) {
    const userData = {
        trainName: data.trainName,
        frequency: data.frequency,
        stations: data.stations,
        from: data.from,
        to: data.to,
        line: data.line,
        type: data.type,
        seats: data.seats
    };
    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {
                //validate user type

                if (res.type === "admin") {

                    //check if the train was added with name
                    train.find({trainName: data.trainName}).then(res => {
                        if (!res) {
                            // save data
                            train.create(userData)
                                .then(() => {
                                    resolve({status: 200, message: "New train was added successfully", success: true})
                                }).catch(err => {
                                reject({status: 500, message: err, success: false});
                            });
                        } else
                            resolve({status: 200, message: "This train is already added", success: false})
                    }).catch(err => {
                        reject({status: 500, message: err, success: false});
                    })

                } else {
                    reject({status: 403, message: "You cannot have permission to do this action", success: false});
                }
            } else {
                reject({status: 401, message: "Please sign in before add new train", success: false});
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before add new train", success: false});
        });
    })
};
/**
 * thhis method will update traininfo which is found by its id
 * @param id
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
trainService.updateTrainInfo = function (id, data, header) {
    const userData = {
        trainName: data.trainName,
        frequency: data.frequency,
        stations: data.stations,
        from: data.from,
        to: data.to,
        line: data.line,
        type: data.type,
        seats: data.seats,
        updatedAt: moment()
    };
    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {
                //validate user type

                if (res.type === "admin") {

                    //save data
                    train.findByIdAndUpdate(id, {$set: userData}, {new: true}, function (err, docs) {
                        if (err)
                            reject({status: 403, message: "This train is not available", success: false});
                        resolve({status: 200, message: "Successfully updated", success: true});
                    });
                } else {
                    reject({status: 403, message: "You cannot have permission to do this action", success: false});
                }
            } else {
                reject({status: 401, message: "Please sign in before add new train", success: false});
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before add new train", success: false});
        });
    })
};
/**
 * get all train informations
 * @returns {Promise<any>}
 */
trainService.getTrains = function () {
    return new Promise(function (resolve, reject) {
        train.find({}, function (err, docs) {
            if (err)
                reject({status: 500, trains: null});
            resolve({status: 200, trains: docs})
        })
    });
};
/**
 * get train information by id
 * @param id
 * @returns {Promise<any>}
 */
trainService.getTrainByID = function (id) {
    return new Promise(function (resolve, reject) {
        train.find({_id: id}, function (err, docs) {
            if (err)
                reject({status: 500, trains: null});
            resolve({status: 200, trains: docs})
        })
    });
};

/**
 * in this method will find train information and return it
 * @param data is departure,arrival,seats,time,class,date,day
 * @returns {Promise<any>}
 */

trainService.checkAvailability = function (data) {
    return new Promise(function (resolve, reject) {
        let query = {
            frequency: data.day,
            "stations.station": data.departure,
            "stations.station": data.arrival

        };
        train.find(query, function (err, docs) {
            if (err)
                reject({status: 500, trains: null});
            resolve({status: 200, trains: docs})
        })
    })
};

module.exports = trainService;