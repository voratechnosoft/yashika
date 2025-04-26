const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vFabricId: Joi.string().required().label("Fabric Id"),
  vFabricQuality: Joi.string().required().label("Fabric Quality").trim(),
});

module.exports = updateSchema;
