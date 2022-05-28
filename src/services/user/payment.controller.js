const axios = require('axios');
const crypto = require('crypto');
const { PAYMOB_APIKEY, PAYMOB_integration_id, PAYMOB_HMAC, exchange_api } = require('../../config/env');
const { failedRes, successfulRes } = require('../../utils/response');
const Course = require('../course/course.model');
const { planModel } = require('../plans/plans.model');
const User = require('./user.model');

exports.payment = async (req, res) => {
  const step1Url = 'https://accept.paymob.com/api/auth/tokens';
  const step2Url = 'https://accept.paymob.com/api/ecommerce/orders';
  const step3Url = 'https://accept.paymob.com/api/acceptance/payment_keys';

  const { user_id, package_id, course_id } = req.body;

  try {
    let user = await User.findById(user_id).exec();

    const phone = '01016191997';

    let order;
    if ((course_id && package_id) || (!course_id && !package_id)) {
      throw new Error('course_id or package_id are required but not all of them');
    }
    if (course_id) {
      order = await Course.findById(course_id).exec();
    } else {
      order = await planModel.findById(package_id).exec();
    }

    let priceInEGP = order.price;

    const docDate = order.rateEGP.toISOString().split('T')[0];
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

    const auth_token = step1.data.token;
    const step2 = await axios.post(step2Url, {
      auth_token,
      delivery_needed: false,
      amount_cents: order.priceEGP * 100,
      currency: 'EGP',
      items: [
      {
        name: 'Payment for premium plan subscription',
        description: package_id,
        amount_cents: 5000,
        quantity: 1,
      },
      {
        name: 'Payment for course enrollment',
        description: course_id,
        amount_cents: 5000,
        quantity: 1,
      }
      ],
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
  const user = req.session.user;
  const course = req.session.course;

  try {
    const { order, source_data } = req.body.obj;
    console.log(req.body.obj.order.items);
return successfulRes(res, 200, req.body);
    //prettier-ignore
    const hmacKeys = ({ amount_cents, created_at, currency, error_occured, 
      has_parent_transaction, id, integration_id, is_3d_secure, is_auth, 
      is_capture, is_refunded, is_standalone_payment, is_voided, order, owner, 
      pending, pan, sub_type, type, success } = req.body.obj);

    hmacKeys.order = order.id;
    hmacKeys.pan = source_data.pan;
    hmacKeys.sub_type = source_data.sub_type;
    hmacKeys.type = source_data.type;

    const conString = `${Object.values(hmacKeys)}`.replaceAll(',', '');
    const hmac = createHmac('SHA512', PAYMOB_HMAC).update(conString).digest('hex');
    if (hmacKeys.success) {
      const doc = await User.findById(user._id).exec();
      
      await doc.save();
    }else{
      throw new Error('The payment process has been failed');
    }

    if (hmac == req.query.hmac) {
      return successfulRes(res, 200, 'Payment has been successful' );
    } else {
      throw new Error(`HMAC hash string not the same `);
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
