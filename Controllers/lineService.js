const route = require('../Models/lineModel');
const moment = require('moment');
const userService = require('../Controllers/userService');

const lineService = function () {
};

/**
 * this method will create new line
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
lineService.addRoute = function (data, header) {
    const userData = {
        line: data.line,
        stations: data.stations,
        to: data.to,
        from: data.from
    };

    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {
                //validate user type

                if (res.type === "admin") {

                    route.create(userData).then(() => {
                        resolve({status: 200, success: true, message: "Successfully added new Route"})
                    }).catch(err => {
                        reject({status: 200, success: false, message: err})
                    })
                } else {
                    reject({status: 403, message: "You cannot have permission to do this action", success: false});
                }
            } else {
                reject({status: 401, message: "Please sign in before add new Line", success: false});
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before add new Line", success: false});
        });
    });
};
/**
 * this method will return all routes
 * @returns {Promise<any>}
 */
lineService.getAll = function () {
    return new Promise(function (resolve, reject) {
        route.find({}).then(res => {
            if (res)
                resolve({status: 200, success: true, line: res});
            else
                resolve({status: 200, success: false, line: res})
        }).catch(err => {
            reject({status: 200, success: false, line: null})
        });
    })
};
/**
 * this method will be return line information by id
 * @param line
 * @returns {Promise<any>}
 */
lineService.getInfoByID = function (id) {
    return new Promise(function (resolve, reject) {
        route.find({_id: id}).then(res => {
            if (res.length !== 0)
                resolve({status: 200, success: true, line: res});
            else
                resolve({status: 200, success: false, line: res})
        }).catch(err => {
            reject({status: 200, success: false, line: null})
        });
    })
};
/**
 * this method can update line information by given id
 * @param id
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
lineService.updateInfo = function (id, data, header) {
    const userData = {
        line: data.line,
        stations: data.stations,
        to: data.to,
        from: data.from,
        updatedAt: moment()
    };

    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {
                //validate user type

                if (res.type === "admin") {

                    //update line information
                    route.findByIdAndUpdate(id, {$set: userData}, {new: true}, function (err, docs) {
                        if (err)
                            reject({status: 403, message: "This Route is not available", success: false});
                        resolve({status: 200, message: "Successfully updated", success: true});
                    });

                } else {
                    reject({status: 403, message: "You cannot have permission to do this action", success: false});
                }
            } else {
                reject({status: 401, message: "Please sign in before add new Line", success: false});
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before add new Line", success: false});
        });
    });
};

/**
 * this method will be delete resource
 * @param id
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
lineService.deleteLine = function (id, header) {

    return new Promise(function (resolve, reject) {
        userService.isLoggedUser(header._token, header._id).then(res => {
            //authenticate user
            if (res.isLogged) {
                //validate user type

                if (res.type === "admin") {

                    //remove line information
                    route.findByIdAndRemove(id, function (err, data) {
                        if (err)
                            reject({status: 403, message: "This Route is not available", success: false});
                        resolve({status: 200, message: "Successfully deleted", success: true});

                    })

                } else {
                    reject({status: 403, message: "You cannot have permission to do this action", success: false});
                }
            } else {
                reject({status: 401, message: "Please sign in before delete new resources", success: false});
            }
        }).catch(err => {
            reject({status: 401, message: "Please sign in before delete resources", success: false});
        });
    });
};
module.exports = lineService;