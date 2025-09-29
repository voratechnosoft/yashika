const { Joi } = require("../../../utils/schemaValidate");

const reSendOtpSchema = Joi.object({
  vEmail: Joi.string().required().label("Email"),
});

module.exports = reSendOtpSchema;
