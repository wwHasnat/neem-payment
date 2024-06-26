const Joi = require("joi");

function validateCustomer(req, res, next) {
  const schema = Joi.object({
    basketId: Joi.string().required(),
    txnamt: Joi.required(),
    orderDate: Joi.string().isoDate().required(),
    customerEmailAddress: Joi.string().email(),
    customerIp: Joi.string().ip().required(),
    scheme: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    generateOtpUrl: Joi.boolean(),
    accountDetails: Joi.object({
      bank_code: Joi.string().required(),
      account_number: Joi.string().required(),
      account_title: Joi.string().required(),
      cnic_number: Joi.string().required(),
    }).required(),
  }).required();

  if (!req.body.validateCustomer)
    return res.status(400).json({ success: false, mag: "Bad Request" });
  const { error } = schema.validate(req.body.validateCustomer);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  next();
}
function initaitePayment(req, res, next) {
  const schema = Joi.object({
    mobileNumber: Joi.string(),
    transactionId: Joi.string().required(),
    scheme: Joi.string().required(),
    otp: Joi.required(),
    data3dsPares: Joi.string().allow("").optional(),
    accountDetails: Joi.object({
      bank_code: Joi.string().required(),
      account_number: Joi.string().required(),
      account_title: Joi.string().required(),
      cnic_number: Joi.string().required(),
    }).required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, msg: error.details[0].message });

  next();
}

module.exports = { validateCustomer, initaitePayment };
