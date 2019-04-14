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
        route: data.route,
        type: data.type,
        seats: data.seats
    };
    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {
                //validate user type

                if (res.type === "admin") {

                    //save data
                    train.create(userData)
                        .then(() => {
                            resolve({status: 200, message: "New train was added successfully", success: true})
                        }).catch(err => {
                        reject({status: 500, message: err, success: false});
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
module.exports = trainService;