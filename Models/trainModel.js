const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainSchema = new Schema({
    trainName: {
        type: String,
        required: true
    },
    frequency: {
        type: Schema.Types.Mixed,
        required: true
    },
    route: {
        type: Schema.Types.Mixed,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    seats: {
        type: Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});
var train = mongoose.model("train", trainSchema);
module.exports = train;