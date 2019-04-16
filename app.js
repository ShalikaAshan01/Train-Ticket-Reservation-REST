var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoute');
var trainRouter = require('./routes/trainRoutes');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());

process.env.SECRET_KEY = "secret-ds-assignment";

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/trs', {useNewUrlParser: true})
    .then(()=> {
      let message = "Successfully connected to MongoDB";
      console.log(message);
    }).catch((err)=>{
      let message = "Cannot Connected to MongoDB " + err;
      console.log(message);
    });

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trains', trainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
