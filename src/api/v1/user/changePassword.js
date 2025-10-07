const { Joi } = require("../../../utils/schemaValidate");

const changePasswordSchema = Joi.object({
  vOldPassword: Joi.string().required().label("Old Password"),
  vNewPassword: Joi.string().required().label("New Password"),
});

module.exports = changePasswordSchema;
