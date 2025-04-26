const { Joi } = require("../../../utils/schemaValidate");

const homeSchema = Joi.object({
  vCategoryId: Joi.string().label("Category Id").allow(""),
  vFabricId: Joi.string().label("Fabric Id").allow(""),
  vDesignNumber: Joi.string().label("Design Number").allow(""),
});

module.exports = homeSchema;
