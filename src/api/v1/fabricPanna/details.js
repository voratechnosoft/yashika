const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vFabricPannaId: Joi.string().required().label("Fabric Panna"),
});

module.exports = getDetailSchema;
