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
const { studentSchema } = require('./schemas.js');

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

const validateStudent = (req, res, next) => {
  const { error } = studentSchema.validate(req.body);
  // console.log(result);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/school/:id/newclass', async (req, res) => {
  const school = await Student.findById(req.params.id);
  // res.send(campground._id);
  res.render(`school/newclass`, { school });
});

app.post('/school/:id/newclass', async (req, res) => {
  // const id = req.body.newclass.id.trim().toString();
  const { id } = req.params;
  const names = req.body.newclass.name.trim().toString();

  const curr = await Student.findOne({ _id: id });

  curr.subs.push({ name: names });
  // curr.subs[0].studentsall.push({ firstName: 'Suresh', lastName: 'Kumar' });
  await curr.save();
  res.redirect(`/school/${id}`);
});

app.get('/school/:id/newclass/:id1', async (req, res) => {
  const { id } = req.params;
  const { id1 } = req.params;
  const school = await Student.findById(id);

  const idOfClass = school.subs.find(x => x._id == id1)._id;
  const className = school.subs.find(x => x._id == id1).name;
  const allStudent = school.subs.find(x => x._id == id1).studentsall;

  res.render(`school/allstudents`, {
    data: { id: id, id1: idOfClass, class: className, students: allStudent },
  });
});

app.get('/school/:id/class/:id1/addstudent', async (req, res) => {
  const { id } = req.params;
  const { id1 } = req.params;

  res.render('school/addstudent', {
    data: { id: id, id1: id1 },
  });
});

app.post('/school/:id/class/:id1/addstudent', async (req, res) => {
  const { id } = req.params;
  const idOfSchool = id.toString();
  const trimedIdOfSchool = idOfSchool.trim();
  const { id1 } = req.params;
  const nameOfStudent = req.body.student.name;
  console.log(idOfSchool);

  const idOfClass = id1.toString();
  const trimedIdOfClass = idOfClass.trim();

  const school = await Student.findById({ _id: trimedIdOfSchool });

  const classOfStudent = await school.subs.find(x => x._id == trimedIdOfClass)
    .studentsall;

  await classOfStudent.push({ nameofstudent: nameOfStudent });

  await school.save();

  res.redirect(`/school/${trimedIdOfSchool}/newclass/${trimedIdOfClass}`);
});

app.get('/school/:id/newclass/:id1/student/:id2', async (req, res) => {
  const { id } = req.params;
  const idOfCampground = id.toString();
  const trimedIdOfSchool = idOfCampground.trim();
  const { id1 } = req.params;
  const idOfClass = id1.toString();
  const trimedIdOfClass = idOfClass.trim();
  const { id2 } = req.params;
  const idOfStudent = id2.toString();
  const trimedIdOfStudent = idOfStudent.trim();

  const school = await Student.findById({ _id: trimedIdOfSchool });
  const className = await school.subs.find(x => x._id == trimedIdOfClass).name;
  const studentInfo = await school.subs.find(x => x._id == trimedIdOfClass)
    .studentsall;

  const partistudent = await studentInfo.find(x => x._id == trimedIdOfStudent)
    .eachstudent;
  const nameOfStudent = await studentInfo.find(x => x._id == trimedIdOfStudent)
    .nameofstudent;
  console.log(id);
  console.log(id1);
  console.log(id2);

  console.log(partistudent.length);
  await school.save();
  // res.send(partistudent);
  const properties = [];
  for (var i = 0; i < partistudent.length; i++) {
    var obj = partistudent[i];

    for (var key in obj) {
      console.log(key, obj[key]);
      properties.push(key);
      properties.push(obj[key]);
    }
  }

  res.render('school/partistudent', {
    data: {
      id: trimedIdOfSchool,
      id1: trimedIdOfClass,
      id2: trimedIdOfStudent,
      student: partistudent,
      proper: properties,
      name: nameOfStudent,
    },
  });
  // res.render('campgrounds/partistudent');
});

app.get('/school/:id/class/:id1/student/:id2/newproperty', async (req, res) => {
  const { id } = req.params;
  const { id1 } = req.params;
  const { id2 } = req.params;

  const idOfSchool = id.toString();
  const trimedIdOfSchool = idOfSchool.trim();

  const idOfClass = id1.toString();
  const trimedIdOfClass = idOfClass.trim();

  const idOfStudent = id2.toString();
  const trimedIdOfStudent = idOfStudent.trim();

  res.render('school/newproperty', {
    data: {
      id: trimedIdOfSchool,
      id1: trimedIdOfClass,
      id2: trimedIdOfStudent,
    },
  });
});

app.post(
  '/school/:id/class/:id1/student/:id2/newproperty',
  async (req, res) => {
    const { id } = req.params;
    const { id1 } = req.params;
    const { id2 } = req.params;

    const idOfSchool = id.toString();
    const trimedIdOfSchool = idOfSchool.trim();

    const idOfClass = id1.toString();
    const trimedIdOfClass = idOfClass.trim();

    const idOfStudent = id2.toString();
    const trimedIdOfStudent = idOfStudent.trim();

    const school = await Student.findById({ _id: trimedIdOfSchool });
    const classOfStudent = await school.subs.find(x => x._id == trimedIdOfClass)
      .studentsall;

    const student = await classOfStudent.find(x => x._id == trimedIdOfStudent)
      .eachstudent;

    const keys = req.body.property.key.toString();
    const value = req.body.property.value.toString();

    const obj = {};
    obj[keys] = value;
    // console.log(obj);
    student.push(obj);
    await school.save();

    // res.send(student);
    res.redirect(
      `/school/${trimedIdOfSchool}/newclass/${trimedIdOfClass}/student/${trimedIdOfStudent}/`
    );
  }
);

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
  validateStudent,
  catchAsync(async (req, res) => {
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
  validateStudent,
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
