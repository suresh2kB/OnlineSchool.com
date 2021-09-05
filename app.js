const express = require('express');
const app = express();
const path = require('path');
const Student = require('./models/schools');
const mongoose = require('mongoose');
const Joi = require('joi');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

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
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/school',
  catchAsync(async (req, res) => {
    const students = await Student.find({});
    res.render('school/index', { students });
  })
);

app.get(
  '/school/new',
  catchAsync(async (req, res) => {
    res.render('school/new');
  })
);

app.get(
  '/school/:id',
  catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('school/show', { student });
  })
);

app.post(
  '/school',
  catchAsync(async (req, res) => {
    const studentSchema = Joi.object({
      student: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        image: Joi.string().required(),
        class: Joi.number().required().min(0),
        description: Joi.string().required(),
        fees: Joi.number().required().min(0),
      }).required(),
    });
    const { error } = studentSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    }
    const stu = new Student(req.body.student);
    await stu.save();
    res.redirect(`school/${stu._id}`);
  })
);

app.get(
  '/school/:id/edit',
  catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('school/edit', { student });
  })
);

app.put(
  '/school/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const stu = await Student.findByIdAndUpdate(id, { ...req.body.student });
    res.redirect(`/school/${stu._id}`);
  })
);

app.delete(
  '/school/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.redirect('/school');
  })
);

app.get('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Something went Wrong';
  }
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Listining on port 3000');
});
