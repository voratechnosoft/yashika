const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vDailyUpdateId: Joi.string().required().label("Daily Update Id"),
});

module.exports = getDetailSchema;
