const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vWorkerId: Joi.string().required().label("Worker Id"),
  vWorkerName: Joi.string().required().label("Worker Name").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
});

module.exports = updateSchema;
