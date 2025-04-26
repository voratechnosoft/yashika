const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vWorkingName: Joi.string().required().label("Working Name").trim(),
  vWorkingType: Joi.string().required().label("Working Type").trim(),
});

module.exports = saveSchema;
