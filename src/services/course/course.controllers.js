const Course = require('./course.model');
const {Admin, Instructor, Student} = require('../../config/roles');
const {freePlan, premiumPlan} = require('../../config/membership');
const { successfulRes, failedRes } = require('../../utils/response');

const filterPremium = (course, membership)=>{
  if(membership == freePlan && course.membership == premiumPlan){
    course.lessons = undefined;
    course.quizzes = undefined;
  }
  return course;
}

const filterByMembership = (response, membership, role, instID)=>{
  if(role == Instructor){
    if(!response){
      return null;
    }else if(response.length && response.length>0){
      response.forEach((e, i)=>{
        if(e.instructor != instID)response[i]=filterPremium(e, membership);
      });
    }else{
      if(response.instructor != instID)response=filterPremium(response, membership);
    }
  } else{
    if(!response){
      return null;
    }else if(response.length && response.length>0){
      response.forEach((e, i)=>{
        response[i]=filterPremium(e, membership);
      });
    }else{
      response=filterPremium(response, membership);
    }
  }
  return response;
}

exports.getCourses = async (req, res) => {
  try {
    let q = req.query;
    let response;
    const id = res.locals.user.id;
    const role = res.locals.user.role;
    const membership = res.locals.user.membership;

    if (q.name) {
      response = await Course.find({
        name: q.name,
      }).exec();
    } else if (q.instructor) {
      response = await Course.find({
        instructor: q.instructor,
      }).exec();
    } else {
      response = await Course.find({}).exec();
    }
    

  //filter Response
  if(role == Instructor){
    response = filterByMembership(response, membership, role, id)
  }else {
    response = filterByMembership(response, membership, role, null)
  }
  
  if(response && response.length && response.length>0){
    for(let i=0; i<response.length; i++){
      response[i] = await response[i].populate('instructor');
    }
  }else{
    response = await response.populate('instructor');
  }
  return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const id = res.locals.user.id;
    const role = res.locals.user.role;
    const membership = res.locals.user.membership;
    let response = await Course.findById(_id).exec();

    if(role == Instructor){
      response = filterByMembership(response, membership, role, id)
    }else {
      response = filterByMembership(response, membership, role, null)
    }
    response = await response.populate('instructor');
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, price, instructor, text, list, membership} = req.body;

    const saved = new Course({
      name,
      price,
      instructor,
      description: {
        text: text,
        list: list,
      },
      membership,
    });

    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, price, instructor, text, list, membership } = req.body;
    let doc = await Course.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.price = price ? price : doc.price;
    doc.instructor = instructor ? instructor : doc.instructor;
    doc.membership = membership ? membership : doc.membership;

    doc.description = {
      text: text ? text : doc.description.text,
      list: list ? list : doc.description.list,
    };

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Course.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
