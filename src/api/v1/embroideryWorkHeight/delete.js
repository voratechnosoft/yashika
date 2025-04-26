const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vEmbroideryWorkHeightId: Joi.string()
    .required()
    .label("Embroidery Work Height"),
});
module.exports = deleteSchema;
