const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getUsers = async (req, res) => {
  try {
    let q = req.query;
    let response;

    if (q.name) {
      response = await User.find({
        name: q.name,
      }).exec();
    } else if (q.role) {
      response = await User.find({
        role: q.role,
      }).exec();
    } else {
      response = await User.find({}).exec();
    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findById(_id).exec();
    response.password = undefined;

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, role, membership } = req.body;
    const photo = req.file?.path;

    const saved = new User({
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
      membership,
      photo,
    });

    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const { first_name, last_name, email, phone, password, role, membership } = req.body;
    const photo = req.file?.path;

    let doc = await User.findById(_id);

    doc.first_name = first_name ? first_name : doc.first_name;
    doc.last_name = last_name ? last_name : doc.last_name;
    doc.email = email ? email : doc.email;
    doc.phone = phone ? phone : doc.phone;
    doc.password = password ? password : doc.password;
    doc.role = role ? role : doc.role;
    doc.membership = membership ? membership : doc.membership;
    doc.photo = photo ? photo : doc.photo;

    const valid = doc.validateSync();
    if (valid) throw valid;
    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
