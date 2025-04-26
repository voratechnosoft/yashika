const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vFusionId: Joi.string().required().label("Fusion"),
  vName: Joi.string().required().label("Name").trim(),
});

module.exports = updateSchema;
