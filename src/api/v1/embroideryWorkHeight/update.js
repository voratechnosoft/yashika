const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vEmbroideryWorkHeightId: Joi.string()
    .required()
    .label("Embroidery Work Height"),
  vName: Joi.string().required().label("Name").trim(),
});

module.exports = updateSchema;
