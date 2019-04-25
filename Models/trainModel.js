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
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    stations: {
        type: Schema.Types.Mixed,
        required: true
    },
    line: {
        type: String,
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