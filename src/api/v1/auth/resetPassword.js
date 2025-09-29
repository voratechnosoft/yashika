const { Joi } = require("../../../utils/schemaValidate");

const resetPasswordSchema = Joi.object({
  vEmail: Joi.string().required().label("Email"),
  vNewPassword: Joi.string().required().label("New Password"),
});

module.exports = resetPasswordSchema;
