const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    imglink: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    cost: { type: Number, required: true },
    disc: { type: String, required: true, },
    enddate: { type: Date, }
}
);

const EventData = mongoose.model('EventData', eventSchema)

module.exports = EventData;