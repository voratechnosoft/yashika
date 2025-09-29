const { Joi } = require("../../../utils/schemaValidate");

const emailOtpSchema = Joi.object({
  vEmail: Joi.string().required().label("Email"),
  vOtp: Joi.string().required().label("OTP"),
  isNewRegisterVerify: Joi.boolean()
    .label("Is New Register Verify")
    .default(false),
});

module.exports = emailOtpSchema;
