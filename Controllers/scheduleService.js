const schedule = require('../Models/scheduleModel');
const moment = require('moment');
const userService = require('../Controllers/userService');

const scheduleFunctions = {};

scheduleFunctions.createSchedule = function (data) {
    const values = {
        trainID: data.trainID,
        trainName: data.trainName,
        scheduleDate: data.date,
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
                reject({status: 500, message: err});
            else if (docs.length <= 0) {
                schedule.create(values)
                    .then(() => resolve({status: 200, message: "New Schedule Added", success: true}))
                    .catch(err => {
                        reject({status: 500, message: err, success: false})
                    })
            } else {
                resolve({status: 200, message: "Already Created", success: false})
            }
        })
    });
};

// userService.isLoggedUser(header._token, header._id).then(res => {
//     //authenticate user
//     if (res.isLogged) {
//
//
//     } else {
//         reject({status: 401, message: "Please sign in before add new train", success: false});
//     }
// }).catch(err => {
//     reject({status: 401, message: "Please sign in before add new train", success: false});
// });

module.exports = scheduleFunctions;