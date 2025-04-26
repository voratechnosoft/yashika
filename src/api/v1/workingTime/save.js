const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vTimeInHours: Joi.string().required().label("Time In Hours").trim(),
  vTimeInMinutes: Joi.string().required().label("Time In Minutes").trim(),
});

module.exports = saveSchema;
