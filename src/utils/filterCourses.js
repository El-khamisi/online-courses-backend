const { freePlan, premiumPlan } = require('../config/membership');
const { Instructor } = require('../config/roles');

const filterPremium = (course, membership) => {
  if (membership == freePlan && course.membership == premiumPlan) {
    course.lessons = undefined;
  }
  return course;
};

const filterByMembership = (course, membership, role, instID) => {
  if (role == Instructor) {
    if (!course) {
      return null;
    } else if (course.length && course.length > 0) {
      course.forEach((e, i) => {
        if (e.instructor != instID) course[i] = filterPremium(e, membership);
      });
    } else {
      if (course.instructor != instID) course = filterPremium(course, membership);
    }
  } else {
    if (!course) {
      return null;
    } else if (course.length && course.length > 0) {
      course.forEach((e, i) => {
        course[i] = filterPremium(e, membership);
      });
    } else {
      course = filterPremium(course, membership);
    }
  }
  return course;
};

module.exports = {
  // filterByMembership,
};
