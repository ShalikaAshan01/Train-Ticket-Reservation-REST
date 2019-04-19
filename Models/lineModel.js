const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//station is a json object
//ex:{{station:yyy,status:closed},{station:xxx,status:active}}
const lineSchema = new Schema({
    line: {
        type: String,
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
    closedStations: {
        type: Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});
var line = mongoose.model("line", lineSchema);
module.exports = line;