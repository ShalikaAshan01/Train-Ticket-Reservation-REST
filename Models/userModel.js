const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    _token: {
        type: Schema.Types.Mixed
    },
    nic:{
        type:String,
        required:true
    },
    telephoneNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    paymentInfo:{
        type:Schema.Types.Mixed
    },
    status:{
        type:String,
        default: "activated"
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt: {
        type:Date,
        default: Date.now()
    },
    updatedAt: {
        type:Date
    }
});
var user = mongoose.model("user",userSchema);
module.exports = user;