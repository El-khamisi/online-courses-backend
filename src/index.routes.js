const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const multer = require('multer');
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
const plans = require('./services/plans/plans.routes');

const { sign, serialize } = require('./utils/cookie');
const { initPlans } = require('./services/plans/plans.model');

module.exports = async (app) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(morgan('dev'));

  let clientPromise;
  if (NODE_ENV == 'dev') {
    clientPromise = mongoose
      .connect(DBURI)
      .then((conn) => {
        console.log('connected to local database successfully');
        return conn.connection.getClient();
      })
      .catch(() => {
        console.log("can't connect to remote database");
      });
  } else {
    clientPromise = mongoose
      .connect(DBURI_remote)
      .then((conn) => {
        console.log('connected to database successfully');
        return conn.connection.getClient();
      })
      .catch(() => {
        console.log("can't connect to database");
      });
  }
  initPlans();

  // Middlewares
  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://textgenuss.net'],
      credentials: true,
    })
  );

  app.use(
    session({
      name: 's_id',
      secret: TOKENKEY,
      store: MongoStore.create({ clientPromise }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, //24 Hours OR Oneday
        sameSite: NODE_ENV == 'dev' ? '' : 'none',
        secure: NODE_ENV == 'dev' ? false : true,
        httpOnly: false,
      },
    }),
    (req, res, next) => {
      
        const signed = 's:' + sign(req.sessionID, TOKENKEY);
        let data = serialize('s_id', signed, req.session.cookie.data);
        //
        if (NODE_ENV != 'dev') data += '; Secure; SameSite=None';
        const prev = res.getHeader('Set-Cookie') || [];
        var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];

        res.setHeader('Set-Cookie', header);
      
      return next();
    }
  );
  const unless = function (paths, middleware) {
    let flag = false;
    return function (req, res, next) {
      for (let i = 0; i < paths.length; i++) {
        if (new RegExp(paths[i]).test(req.path)) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return next();
      } else {
        console.log('Using multer.none');
        return middleware(req, res, next);
      }
    };
  };
  app.use(unless(['/admin/course/*', '/admin/user/*', '/myprofile'], multer().none()));

  //Routers
  app.use(login);
  app.use(dashboard);
  app.use(course);
  app.use(lesson);
  app.use(quiz);
  app.use(reading);
  app.use(profile);

  app.use(membership);
  app.use(role);
  app.use(plans);
};
