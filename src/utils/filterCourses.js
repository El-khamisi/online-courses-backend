const { freePlan, premiumPlan } = require('../config/membership');
const { Instructor } = require('../config/roles');

const filterPremium = (course, membership) => {
  if (membership == freePlan && course.membership == premiumPlan) {
    course.lessons = undefined;
  }
  return course;
};

const filterByMembership = (response, membership, role, instID) => {
  if (role == Instructor) {
    if (!response) {
      return null;
    } else if (response.length && response.length > 0) {
      response.forEach((e, i) => {
        if (e.instructor != instID) response[i] = filterPremium(e, membership);
      });
    } else {
      if (response.instructor != instID) response = filterPremium(response, membership);
    }
  } else {
    if (!response) {
      return null;
    } else if (response.length && response.length > 0) {
      response.forEach((e, i) => {
        response[i] = filterPremium(e, membership);
      });
    } else {
      response = filterPremium(response, membership);
    }
  }
  return response;
};

module.exports = {
  filterByMembership,
};
