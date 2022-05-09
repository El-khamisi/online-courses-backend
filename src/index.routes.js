const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const { TOKENKEY, DBURI, DBURI_remote, NODE_ENV } = require('./config/env');

const login = require('./services/login/login.routes');
const course = require('./services/course/course.routes');
const lesson = require('./services/lesson/lesson.routes');
const quiz = require('./services/quiz/quiz.routes');
const reading = require('./services/reading/reading.routes');
const dashboard = require('./services/dashboard/index.routes');
const membership = require('./services/membership/membership.routes');
const role = require('./services/role/role.routes');
const profile = require('./services/user/profile.routes');

module.exports = async (app) => {
  
  let clientPromise;
  if(NODE_ENV == 'dev'){
    clientPromise = mongoose.connect(DBURI)
    .then((conn) => {
      console.log('connected to database successfully');
      return conn.connection.getClient();
    })
    .catch(() => {
      console.log("can't connect to database");
    });
  }else{
    clientPromise = mongoose.connect(DBURI_remote)
    .then((conn) => {
      console.log('connected to database successfully');
      return conn.connection.getClient();
    })
    .catch(() => {
      console.log("can't connect to database");
    });
  }

  // Middlewares
  app.use(
    session({
      secret: TOKENKEY,
      store: MongoStore.create({ clientPromise }),
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: NODE_ENV == 'dev'? false : true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, //24 Hours OR Oneday
      },
    })
  );
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
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
  app.use(profile);

  app.use(membership);
  app.use(role);
};
