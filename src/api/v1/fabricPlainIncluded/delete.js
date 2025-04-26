const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vFabricPlainIncludedId: Joi.string()
    .required()
    .label("Fabric Plain Included"),
});
module.exports = deleteSchema;
