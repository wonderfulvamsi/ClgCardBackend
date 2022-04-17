const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const canteenSchema = new Schema({
    imglink: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    cost: { type: Number, required: true },
}
);

const CanteenData = mongoose.model('CanteenData', canteenSchema)

module.exports = CanteenData;