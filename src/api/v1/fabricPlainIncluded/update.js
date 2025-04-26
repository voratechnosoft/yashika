const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vFabricPlainIncludedId: Joi.string()
    .required()
    .label("Fabric Plain Included"),
  vName: Joi.string().required().label("Name").trim(),
});

module.exports = updateSchema;
