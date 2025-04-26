const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vFabricId: Joi.string().required().label("Fabric Id"),
});
module.exports = deleteSchema;
