const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vWorkingDayId: Joi.string().required().label("Working day Id"),
  vWorkingName: Joi.string().required().label("Working Name").trim(),
  vWorkingType: Joi.string().required().label("Working Type").trim(),
});

module.exports = updateSchema;
