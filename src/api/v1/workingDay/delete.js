const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vWorkingDayId: Joi.string().required().label("Working day Id"),
});
module.exports = deleteSchema;
