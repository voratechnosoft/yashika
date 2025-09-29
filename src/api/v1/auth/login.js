const { Joi } = require("../../../utils/schemaValidate");

const loginSchema = Joi.object({
  vMobile: Joi.string().required().label("Mobile"),
  vApkType: Joi.string().required().label("App Type"),
  vPassword: Joi.string().label("Password").allow(""),
  // vPassword: Joi.string().required().label("Password"),
  isNewUpdate: Joi.boolean().label("Is New Update").default(false),
});

module.exports = loginSchema;
