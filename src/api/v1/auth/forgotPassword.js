const { Joi } = require("../../../utils/schemaValidate");

const forgotPasswordSchema = Joi.object({
  vEmail: Joi.string().required().label("Email"),
});

module.exports = forgotPasswordSchema;
