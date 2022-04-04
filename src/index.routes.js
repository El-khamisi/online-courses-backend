const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const login = require('./services/login/login.routes');
const course = require('./services/course/course.routes');

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

  app.use(course);
  app.use(login);
};
