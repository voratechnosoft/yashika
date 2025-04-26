const { Joi } = require("../../../utils/schemaValidate");

const registerSchema = Joi.object({
  vName: Joi.string().required().label("Name"),
  vMobile: Joi.string().required().label("Mobile"),
});

module.exports = registerSchema;
