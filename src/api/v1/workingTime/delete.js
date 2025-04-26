const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vWorkingTimeId: Joi.string().required().label("Working Time Id"),
});
module.exports = deleteSchema;
