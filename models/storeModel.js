const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    imglink: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    cost: { type: Number, required: true },
}
);

const StoreData = mongoose.model('StoreData', storeSchema)
module.exports = StoreData;