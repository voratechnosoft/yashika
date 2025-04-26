const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vFabricPannaId: Joi.string().required().label("Fabric Panna"),
});
module.exports = deleteSchema;
