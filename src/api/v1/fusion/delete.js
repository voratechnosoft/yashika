const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vFusionId: Joi.string().required().label("Fusion"),
});
module.exports = deleteSchema;
