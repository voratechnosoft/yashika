const { Joi } = require("../../../utils/schemaValidate");

const likeAndUnLikeCatalogSchema = Joi.object({
  vCatalogId: Joi.string().required().label("Catalog Id"),
  isLike: Joi.boolean().label("isLike").default(true),
});

module.exports = likeAndUnLikeCatalogSchema;
