const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: String,
  address: String,
  image: String,
  class: Number,
  description: String,
  fees: Number,
});

module.exports = mongoose.model('Student', StudentSchema);
