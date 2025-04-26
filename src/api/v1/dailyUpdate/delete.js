const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vDailyUpdateId: Joi.string().required().label("Daily Update Id"),
});
module.exports = deleteSchema;
