const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const libSchema = new Schema({
    imglink: { type: String, required: true },
    bookname: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    type: { type: String, required: true },
    noofcopies: { type: Number, required: true },
}
);

const LibData = mongoose.model('LibData', libSchema)

module.exports = LibData;