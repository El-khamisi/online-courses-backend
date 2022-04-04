const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../services/user/user.model');
const bcrypt = require('bcrypt');

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};

const verifyCallback = (username, password, done) => {
  User.findOne({ email: username })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      const isValid = bcrypt.compareSync(password, user.password);

      if (isValid) {
        user.password = undefined;
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      console.log(user);
      done(null, user);
    })
    .catch((err) => done(err));
});
