const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vWorkerId: Joi.string().required().label("Worker Id"),
});
module.exports = deleteSchema;
