const pricing = require('../Models/pricingModel');
const moment = require('moment');

const pricingService = function () {
};


/**
 * this method will add price information
 * @param data
 * @returns {Promise<any>}
 */
pricingService.add = function (data) {
    let values = {
        price: {
            type: data.type,
            clasaA: data.ClassA,
            clasaB: data.ClassB,
            clasaC: data.ClassC
        }
    };

    return new Promise(function (resolve, reject) {
        pricing.create(values)
            .then(() => {
                resolve({status: 200, message: "Successfully Added", success: true})
            }).catch(err => {
            reject({status: 500, message: err, success: false})
        })
    })

};
/**
 * this method will return price information by type
 * @param type
 * @returns {Promise<any>}
 */
pricingService.getByType = function (type) {
    return new Promise(function (resolve, reject) {
        pricing.findOne({"price.type": type}, function (err, docs) {
            if (err)
                reject({status: 404, price: null, success: false});

            resolve({status: 200, price: docs, success: true});
        })
    })
};


module.exports = pricingService;