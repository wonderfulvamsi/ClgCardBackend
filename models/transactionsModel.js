const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transacSchema = new Schema({
    to: { type: String, required: true },
    rollno: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    sucessful: { type: Boolean, required: true }
}
);

const TransacData = mongoose.model('TransacData', transacSchema)

module.exports = TransacData;