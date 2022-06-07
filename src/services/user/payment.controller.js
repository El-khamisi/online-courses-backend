const axios = require('axios');
const { PAYMOB_APIKEY, PAYMOB_integration_id, PAYMOB_HMAC, exchange_api, NODE_ENV } = require('../../config/env');
const { premiumPlan } = require('../../config/membership');
const { failedRes, successfulRes } = require('../../utils/response');
const Course = require('../course/course.model');
const { planModel } = require('../plans/plans.model');
const { subscribe } = require('../../utils/subscribe');
const User = require('./user.model');

let planPeriod = {};
let guser, course;

exports.payment = async (req, res) => {
  const step1Url = 'https://accept.paymob.com/api/auth/tokens';
  const step2Url = 'https://accept.paymob.com/api/ecommerce/orders';
  const step3Url = 'https://accept.paymob.com/api/acceptance/payment_keys';

  const { user_id, package_id, course_id } = req.body;

  try {
    let user = req.session.user;

    guser = user;
    const phone = user.phone || '01016191997';
    if (!user || !user.first_name || !user.last_name || !user.email) {
      throw new Error(`User data is not completed required [first_name: ${user.first_name}, last_name: ${user.last_name}, email: ${user.email}]`);
    }

    let order;
    if ((course_id && package_id) || (!course_id && !package_id)) {
      throw new Error('course_id or package_id are required but not all of them');
    }
    if (course_id) {
      order = await Course.findById(course_id).exec();
      course = order;
    } else {
      order = await planModel.findById(package_id).exec();
    }

    let priceInEGP = order.price;

    const docDate = order.rateEGP?.toISOString().split('T')[0];
    const date = new Date().toISOString().split('T')[0];
    if (docDate < date || !order.priceEGP) {
      priceInEGP = await axios.get(`https://api.apilayer.com/exchangerates_data/convert?from=USD&to=EGP&amount=${order.price}`, {
        headers: {
          apikey: `${exchange_api}`,
        },
      });
      priceInEGP = priceInEGP.data.result;
      order.priceEGP = priceInEGP;
      order.rateEGP = date;
      await order.save();
    }

    const step1 = await axios.post(step1Url, {
      api_key: PAYMOB_APIKEY,
    });

    package_id ? (planPeriod.name = order.name) : '';
    package_id ? (planPeriod.expire = subscribe(order.name, user.end_of_membership)) : '';
    const item = {
      name: course_id ? course_id : package_id,
      description: course_id ? `Payment for course enrollment` : `Payment for premium plan ${order.name} subscription`,
      amount_cents: order.priceEGP * 100,
      quantity: 1,
    };
    const auth_token = step1.data.token;
    const step2 = await axios.post(step2Url, {
      auth_token,
      delivery_needed: false,
      amount_cents: order.priceEGP * 100,
      currency: 'EGP',
      items: [item],
    });
    const order_id = step2.data.id;
    const step3 = await axios.post(step3Url, {
      auth_token,
      amount_cents: order.priceEGP * 100,
      currency: 'EGP',
      expiration: 3600, //One hour
      order_id,
      integration_id: PAYMOB_integration_id,
      billing_data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: phone,
        apartment: 'NA',
        floor: 'NA',
        street: 'NA',
        building: 'NA',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'NA',
        state: 'NA',
      },
    });

    return successfulRes(res, 200, { payment_token: step3.data.token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.paymentcb = async (req, res) => {
  try {
    //prettier-ignore
    const { pending, success } = req.body.obj;
    const user = guser;

    if (success) {
      let doc = await User.findById(user._id).exec();

      if (req.body.obj.order.items[0].description.includes('course')) {
        doc.inprogress.push({ course: course._id, quizzes: [] });
        user.inprogress.push({ course: course._id, quizzes: [] });
      } else {
        doc.membership = premiumPlan;
        doc.memberplan = planPeriod.name;
        doc.end_of_membership = planPeriod.expire;

        user.membership = premiumPlan;
        user.memberplan = planPeriod.name;
        user.end_of_membership = planPeriod.expire;
      }

      await doc.save();
    } else {
      throw new Error('The payment process has been failed');
    }

    res.end();
  } catch (e) {
    console.log(e);
    NODE_ENV == 'dev' ? console.log(e) : '';

    res.end();
  }
};
