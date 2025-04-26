const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  vDesignNumber: Joi.string().label("Design Number").allow(""),
  arrFabricId: Joi.array().label("Fabric Id Array"),
  arrCategoryId: Joi.array().label("Category Id Array"),
  arrFusionId: Joi.array().label("Fusion Id Array"),
  arrFabricPannaId: Joi.array().label("Fabric Panna Id Array"),
  arrFabricPlainIncludedId: Joi.array().label("Fabric Plain Included Id Array"),
  arrEmbroideryWorkHeightId: Joi.array().label(
    "Embroidery Work Height Id Array"
  ),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = listSchema;
