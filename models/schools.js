const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: String,
  class: String,
  address: String,
  description: String,
  fees: String,
});

module.exports = mongoose.model('Student',StudentSchema);
