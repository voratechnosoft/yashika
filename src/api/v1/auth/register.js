const { Joi } = require("../../../utils/schemaValidate");

const registerSchema = Joi.object({
  vName: Joi.string().required().label("Name"),
  vEmail: Joi.string().required().label("Email"),
  vPassword: Joi.string().required().label("Password"),
  vMobile: Joi.string().required().label("Mobile"),
  vApkType: Joi.string().required().label("App Type"),
});

module.exports = registerSchema;
