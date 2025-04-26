const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vCatalogId: Joi.string().required().label("Catalog Id"),
});
module.exports = deleteSchema;
