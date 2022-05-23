const User = require('../user/user.model');
const bcrypt = require('bcrypt');
const { successfulRes, failedRes } = require('../../utils/response');
const { sign, serialize } = require('../../utils/cookie');
const { TOKENKEY, NODE_ENV } = require('../../config/env');

exports.regUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body;
    if (email && password) {
      password = bcrypt.hashSync(password, 10);
    } else {
      throw new Error('Email and password are REQUIRED');
    }
    let saved = new User({ first_name, last_name, email, password });
    await saved.save();

    const token = saved.generateToken(req, res);
    saved.completed = undefined;
    saved.reads = undefined;
    saved.inprogress = undefined;
    saved.password = undefined;

    return successfulRes(res, 201, { user: saved, token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logUser = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return failedRes(res, 400, null, 'Email and password are REQUIRED');
  }

  try {
    let logged = await User.findOne({
      email,
    }).exec();

    if (!logged) {
      return failedRes(res, 400, null, 'Email is invalid');
    }

    const matched = bcrypt.compareSync(password, logged.password);
    if (!logged || !matched) {
      return failedRes(res, 400, null, 'Email or Password is invalid');
    } else {
      const token = logged.generateToken(req, res);

  
  var signed = 's:' + sign(req.sessionID, TOKENKEY);
  var data = serialize('s_id', signed, req.session.cookie.data);
  if(NODE_ENV != 'dev')
    data+= '; Secure; SameSite=None';
  var prev = res.getHeader('Set-Cookie') || []

  var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];


  // const cook = data.split('s_id')[1].split(';')[0].split('=')[1];
  
  
  res.setHeader('Set-Cookie', header)

  // , {
  //   maxAge: 24 * 60 * 60 * 1000, //24 Hours OR Oneday
  //   sameSite: NODE_ENV == 'dev' ? false : 'none',
  //   secure: NODE_ENV == 'dev' ? false : true,
  // });
  // console.log('mai', data);
  console.log('mai', res.getHeader('Set-Cookie'));
      logged.inprogress = undefined;
      logged.password = undefined;
      return successfulRes(res, 200, { user: logged, token });
    }
    // logged = await logged.populate({ path: 'completed', select: 'name' });
    // logged = await logged.populate({ path: 'reads', select: 'title'});
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logout = (req, res) => {
  try {
    req.session.destroy(() => {});
    res.clearCookie('authorization');
    successfulRes(res, 200, 'You have been logged out successfully');
  } catch (err) {
    failedRes(res, 500, 'Invalid logout operation');
  }
};
