const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentListSchema = new Schema({
    rollno: { type: String, required: true, unique: true },
    mobileno: { type: Number, required: true, },
    registered: { type: Boolean, default: false }
}
);

const StudentList = mongoose.model('StudentList', studentListSchema)

module.exports = StudentList;