const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vFabricId: Joi.string().required().label("Fabric Id"),
});

module.exports = getDetailSchema;
