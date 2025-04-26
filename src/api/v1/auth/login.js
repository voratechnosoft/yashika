const { Joi } = require("../../../utils/schemaValidate");

const loginSchema = Joi.object({
  vMobile: Joi.string().required().label("Mobile"),
  vApkType: Joi.string().required().label("App Type"),
});

module.exports = loginSchema;
