const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vFabricQuality: Joi.string().required().label("Fabric Quality").trim(),
});

module.exports = saveSchema;
