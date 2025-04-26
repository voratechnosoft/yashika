const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vWorkingTimeId: Joi.string().required().label("Working Time Id"),
  vTimeInHours: Joi.string().required().label("Time In Hours").trim(),
  vTimeInMinutes: Joi.string().required().label("Time In Minutes").trim(),
});

module.exports = updateSchema;
