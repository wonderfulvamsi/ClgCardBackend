const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const busSchema = new Schema({
    imglink: { type: String, required: true, },
    busnumber: { type: Number, required: true, unique: true },
    drivernumber: { type: Array, required: true },
    area: { type: String, required: true, },
    cost: { type: Number, required: true, },
    busstops: { type: Array, required: true },
}
);

const BusData = mongoose.model('BusData', busSchema)

module.exports = BusData;