const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//configuration
const { TOKENKEY, NODE_ENV } = require('../../config/env');
const roles = require('../../config/roles');
const membership = require('../../config/membership');

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    email: { type: String, trim: true, required: [true, 'Email is required'], unique: true, validate: [validator.isEmail, 'Invalid Email'] },
    phone: { type: String },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, enum: [...Object.values(roles), 'Invalid role title'], default: roles.Student },
    membership: { type: String, enum: [...Object.values(membership), 'Invalid membership plan'], default: membership.freePlan },
    end_of_membership: { type: Date },
    inprogress: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }] }],
    completed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    reads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reading' }],
    photo: { type: String },
    quizzes: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        date: Date,
        score: { type: Number, set: (v) => Math.round(v * 10) / 10 },
      },
    ],
  },
  { strict: false, timestamps: true }
);

userSchema.methods.generateToken = function (req, res) {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.first_name + ' ' + this.last_name,
      email: this.email,
      photo: this.photo,
      role: this.role,
      membership: this.membership,
    },
    TOKENKEY,
    { expiresIn: '24h' }
  );

  // req.session.user = this;
  res.cookie('authorization', token, {
    maxAge: 24 * 60 * 60 * 1000, //24 Hours OR Oneday
    sameSite: NODE_ENV == 'dev' ? false : 'none',
    secure: NODE_ENV == 'dev' ? false : true,
  });
  return token;
};

//Exclude findOne for Login password
userSchema.post(['save', 'find', 'findByIdAndUpdate', 'findByIdAndDelete'], function (doc, next) {
  if (!doc) {
    next();
  } else if (doc.length && doc.length > 0) {
    doc.forEach((e, i) => {
      doc[i].password = undefined;
    });
  } else {
    doc.password = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
