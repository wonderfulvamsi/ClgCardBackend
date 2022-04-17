const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    rollno: { type: String, required: true },
    mobileno: { type: Number, required: true },
    password: { type: String, required: true },
    bus: { type: Number, default: 0 },
    canteen: { type: Number, default: 0 },
    stores: { type: Number, default: 0 },
    lib: { type: Number, default: 0 },
    event: { type: Number, default: 0 },
    credit: { type: Number, required: true },
    otp: { type: String, },
    otpdate: { type: Number, },
}
);

const UserData = mongoose.model('UserData', userSchema)

module.exports = UserData;