const schedule = require('../Models/scheduleModel');
const moment = require('moment');
const userService = require('../Controllers/userService');
const mongoose = require('mongoose');

const scheduleFunctions = {};

/**
 * this method will create brand new schedule
 * @param data
 * @returns {Promise<any>}
 */
scheduleFunctions.createSchedule = function (data) {
    const values = {
        trainID: data.trainID,
        trainName: data.trainName,
        scheduleDate: moment(new Date(data.date)).format('MM/DD/YYYY'),
        route: {
            from: data.from,
            to: data.to
        },
        availableSeats: {
            A: data.A,
            B: data.B,
            C: data.C,
        }
    };
    return new Promise(function (resolve, reject) {
        let query = {
            trainID: data.trainID,
            scheduleDate: data.date,
            "route.from": data.from,
            "route.to": data.to,
        };
        schedule.find(query, function (err, docs) {
            if (err)
                reject({status: 500, message: "Error: " + err});
            else if (docs.length <= 0) {
                schedule.create(values)
                    .then(() => resolve({status: 200, message: "New Schedule Added", data: data, success: true}))
                    .catch(err => {
                        reject({status: 500, message: "Error: " + err, success: false})
                    })
            } else {
                resolve({status: 200, message: "Already Created", data: docs[0], success: false})
            }
        })
    });
};
/**
 * this method will send specific schedule
 * @param data
 * @returns {Promise<any>}
 */
scheduleFunctions.showScheduleByDateAndTID = function (data) {
    return new Promise(function (resolve, reject) {
        let query = {
            trainID: data._tid,
            scheduleDate: moment(new Date(data.scheduleDate)).format('MM/DD/YYYY')
        };

        schedule.findOne(query, function (err, docs) {
            if (err)
                reject({status: 404, message: "Error: " + err, success: false, schedule: null});
            resolve({status: 200, message: "success", success: true, schedule: docs})
        })
    })
};

/**
 * this method will update schedule model with given reservation information
 * @param date
 * @param id
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
scheduleFunctions.makeReservation = function (date, id, data, header) {
    date = moment(new Date(date)).format("MM/DD/YYYY");

    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {

                let now = moment().format('MMMM Do YYYY, h:mm:ss a').toString();
                let values = {
                    _id: new mongoose.mongo.ObjectId(),
                    userID: data.userID,
                    seats: {
                        class: data.class,
                        noSeats: data.seats
                    },
                    payment: {
                        type: data.type,
                        discount: data.discount,
                        total: data.total
                    },
                    route: {
                        from: data.departure,
                        to: data.arrival
                    },
                    date: now
                };
                console.log(now)
                console.log(date)

                let query = {
                    trainID: id,
                    scheduleDate: date,
                };

                schedule.find(query).then(val => {
                    let availableSeats = val[0].availableSeats[data.class] - data.seats;

                    let obj = {};
                    let seatsString = "availableSeats." + data.class;

                    obj[seatsString] = availableSeats;


                    schedule.findOneAndUpdate(query, obj, {'new': false}, (err, info) => {
                    });

                    schedule.findOneAndUpdate(query, {"$push": {"reservation": values}}, {'new': false}, (err, info) => {
                        if (err) {
                            reject({status: 500, message: "Something went wrong", success: false});
                        } else
                            resolve({status: 200, message: "Successfully Reserved", success: true});
                    })
                }).catch(err => {
                    reject({status: 500, message: "Something went wrong", success: false});
                })


            } else {
                reject({status: 401, message: "Please sign in before make reservation", success: false});
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before make reservation", success: false});
        });
    });
};
/**
 * this method will return all reservations belongs to specific user
 * @param id
 * @returns {Promise<any>}
 */
scheduleFunctions.getReservationByID = function (id) {
    return new Promise(function (resolve, reject) {
        schedule.find({"reservation.userID": id}).then(data => {
            resolve({status: 200, reservation: data, message: null})
        }).catch(err => {
            reject({status: 500, reservation: null, message: "Error: " + err})
        })
    })
};



module.exports = scheduleFunctions;