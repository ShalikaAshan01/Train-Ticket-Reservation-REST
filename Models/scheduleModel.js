const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = Schema.Types;
const scheduleSchema = new Schema({

    trainID: {
        type: Types.ObjectId,
        required: true,
        ref: 'train'
    },
    trainName: {
        type: String,
        required: true,
    },
    scheduleDate: {
        type: Date,
        required: true
    },
    route: {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    },
    availableSeats: {
        A: {
            type: Number,
            required: true
        },
        B: {
            type: Number,
            required: true
        },
        C: {
            type: Number,
            required: true
        }
    },
    reservation: [{
        _id: {
            type: Types.ObjectId
        },
        userID: {
            type: Types.ObjectId,
            required: true,
            ref: 'user'
        },
        seats: {
            class: {type: String, required: true},
            noSeats: {type: Number, required: true}
        },
        payment: {
            type: {type: String, required: true},
            total: {type: Types.Decimal128, required: true}
        },
        date: {type: Date, required: true},
        route: {
            from: {type: String, required: true},
            to: {type: String, required: true}
        }
    }]
});
var schedule = mongoose.model("schedule", scheduleSchema);
module.exports = schedule;