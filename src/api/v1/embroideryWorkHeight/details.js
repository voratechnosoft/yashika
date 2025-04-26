const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vEmbroideryWorkHeightId: Joi.string()
    .required()
    .label("Embroidery Work Height"),
});

module.exports = getDetailSchema;
