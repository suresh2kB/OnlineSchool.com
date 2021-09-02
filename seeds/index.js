const Student = require('../models/schools');
const mongoose = require('mongoose');
const names = require('./names');
const { descriptors, places } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/online-school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
  console.log('Database Connected');
});

const getRandom = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Student.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const name_stu = getRandom(names);
    const address_stu = getRandom(descriptors) + ' ' + getRandom(places);
    const stu = new Student({ class: name_stu, address: address_stu });
    await stu.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
