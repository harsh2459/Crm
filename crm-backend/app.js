var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const companyRouter = require('./routes/companyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const chatRoutes = require('./routes/ChatRoutes');

var app = express();

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', companyRouter);
app.use('/api', employeeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
