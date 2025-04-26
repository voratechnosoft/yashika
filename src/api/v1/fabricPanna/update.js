const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vFabricPannaId: Joi.string().required().label("Fabric Panna"),
  vName: Joi.string().required().label("Name").trim(),
});

module.exports = updateSchema;
