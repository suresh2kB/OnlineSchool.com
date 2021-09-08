const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const students = new Schema({
  nameofstudent: String,
  eachstudent: [],
});

const room = new Schema({
  name: String,
  studentsall: [students],
});

const StudentSchema = new Schema({
  name: String,
  address: String,
  image: String,
  class: Number,
  description: String,
  subs: [room],
  fees: Number,
});

module.exports = mongoose.model('Student', StudentSchema);
