const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vCatalogId: Joi.string().required().label("Catalog Id"),
});

module.exports = getDetailSchema;
