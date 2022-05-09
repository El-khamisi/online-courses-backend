const axios = require('axios');
const crypto = require('crypto');
const { PAYMOB_APIKEY, PAYMOB_integration_id, PAYMOB_HMAC } = require('../../config/env');
const { failedRes, successfulRes } = require('../../utils/response');
const User = require('./user.model');

exports.payment = async (req, res) => {
  const step1Url = 'https://accept.paymob.com/api/auth/tokens';
  const step2Url = 'https://accept.paymob.com/api/ecommerce/orders';
  const step3Url = 'https://accept.paymob.com/api/acceptance/payment_keys';
  const user = req.session.user;
  const course = req.session.course;
  try {
    const step1 = await axios.post(step1Url, {
      api_key: PAYMOB_APIKEY,
    });
    const auth_token = step1.data.token;
    const step2 = await axios.post(step2Url, {
      auth_token,
      delivery_needed: false,
      amount_cents: course.price * 100,
      currency: 'EGP',
      items: [],
    });
    const order_id = step2.data.id;

    const step3 = await axios.post(step3Url, {
      auth_token,
      amount_cents: course.price * 100,
      currency: 'EGP',
      expiration: 3600, //One hour
      order_id,
      integration_id: PAYMOB_integration_id,
      billing_data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone,
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

    return successfulRes(res, 200, step3.data);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.paymentcb = async (req, res) => {
  const user = req.session.user;
  const course = req.session.course;
  try {
    const { order, source_data } = req.body.obj;

    const hmacKeys = ({ amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, order, owner, pending, pan, sub_type, type, success } = req.body.obj);
    hmacKeys.order = order.id;
    hmacKeys.pan = source_data.pan;
    hmacKeys.sub_type = source_data.sub_type;
    hmacKeys.type = source_data.type;

    const conString = `${Object.values(hmacKeys)}`.replaceAll(',', '');
    const hmac = createHmac('SHA512', PAYMOB_HMAC).update(conString).digest('hex');
    if (!hmacKeys.success) {
      throw new Error('The payment process has failed');
    }

    if (hmac == req.query.hmac) {
      const doc = await User.findById(user._id).exec();
      doc.inprogress.push({ course: course._id, lessons: [] });
    } else {
      throw new Error(`HMAC hash string not the same `);
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
