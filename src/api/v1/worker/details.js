const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vWorkerId: Joi.string().required().label("Worker Id"),
});

module.exports = getDetailSchema;
