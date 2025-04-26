const { Joi } = require("../../../utils/schemaValidate");

const getBarcodeWiseDetailsSchema = Joi.object({
  vBarcodeNumber: Joi.string().required().label("Barcode Number"),
});

module.exports = getBarcodeWiseDetailsSchema;
