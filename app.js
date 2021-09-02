const express = require('express');
const app = express();
const path = require('path');
const Student = require('./models/schools');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

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
app.use(express.urlencoded({ urlencoded: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/school', async (req, res) => {
  const students = await Student.find({});
  res.render('school/index', { students });
});

app.get('/school/new', (req, res) => {
  res.render('school/new');
});

app.get('/school/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('school/show', { student });
});

app.post('/school', async (req, res) => {
  const stu = new Student(req.body.student);
  await stu.save();
  res.redirect(`school/${stu._id}`);
});

app.get('/school/:id/edit', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('school/edit', { student });
});

app.put('/school/:id', async (req, res) => {
  const { id } = req.params;
  const stu = await Student.findByIdAndUpdate(id, { ...req.body.student });
  res.redirect(`/school/${stu._id}`);
});

app.delete('/school/:id', async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.redirect('/school');
});

app.listen(3000, () => {
  console.log('Listining on port 3000');
});
