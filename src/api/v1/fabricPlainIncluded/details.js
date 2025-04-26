const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vFabricPlainIncludedId: Joi.string()
    .required()
    .label("Fabric Plain Included Id"),
});

module.exports = getDetailSchema;
