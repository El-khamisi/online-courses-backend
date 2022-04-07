const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { multer } = require('./config/multer');

const login = require('./services/login/login.routes');
const course = require('./services/course/course.routes');
const lesson = require('./services/lesson/lesson.routes');
const quiz = require('./services/quiz/quiz.routes');
const reading = require('./services/reading/reading.routes');
const dashboard = require('./services/dashboard/index.routes');
const membership = require('./services/membership/membership.routes');
const role = require('./services/role/role.routes');

module.exports = (app) => {
  // Middlewares

  /*        
      app.use(passport.initialize());
      app.use(passport.session());
      */

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  //Routers
  app.use(morgan('dev'));

  app.use(login);
  app.use(dashboard);
  app.use(course);
  app.use(lesson);
  app.use(quiz);
  app.use(reading);

  app.use(membership);
  app.use(role);
};
