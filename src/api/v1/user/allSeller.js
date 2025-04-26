const { Joi } = require("../../../utils/schemaValidate");

const deviceTokenSchema = Joi.object({
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = deviceTokenSchema;
