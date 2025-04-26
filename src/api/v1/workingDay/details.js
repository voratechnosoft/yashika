const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vWorkingDayId: Joi.string().required().label("Working day Id"),
});

module.exports = getDetailSchema;
