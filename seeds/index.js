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
    const year = Math.floor(Math.random() * 12) + 1;
    const address_stu = getRandom(descriptors) + ' ' + getRandom(places);
    const stu = new Student({
      name: name_stu,
      address: address_stu,
      image: 'https://source.unsplash.com/collection/483251/',
      class: year,

      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident exercitationem nemo quod optio reprehenderit voluptatibus dolores sit, consequuntur soluta ab rem amet enim quae unde cupiditate itaque eligendi deleniti consequatur.',
    });
    await stu.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
