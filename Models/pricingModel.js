const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// express:{
//     A:"50",
//     B:"50"
// }

const pricingSchema = new Schema({
    price: Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});
var pricing = mongoose.model("pricing", pricingSchema);
module.exports = pricing;