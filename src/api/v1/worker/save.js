const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vWorkerName: Joi.string().required().label("Worker Name").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
});

module.exports = saveSchema;
