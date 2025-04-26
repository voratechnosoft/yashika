const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vWorkingTimeId: Joi.string().required().label("Working Time Id"),
});

module.exports = getDetailSchema;
