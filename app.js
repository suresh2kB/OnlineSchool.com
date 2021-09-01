const express = require('express');
const app = express();
const path = require('path');
const Student = require('./models/schools');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/online-school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
  console.log('Database Connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/makestudent', async (req, res) => {
  const student = new Student({
    name: 'Suresh Kumar',
    class: '12th',
    address: 'Silanwad,Ladnun,Nagour',
    fees: '20000',
  });

  await student.save();
  res.send(student);
});

app.listen(3000, () => {
  console.log('Listining on port 3000');
});
