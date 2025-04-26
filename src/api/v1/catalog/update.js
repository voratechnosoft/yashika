const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vCatalogId: Joi.string().required().label("Catalog Id"),
  vDesignNumber: Joi.string().required().label("Design Number"),
  vCategoryId: Joi.string().label("Category Id").allow(""),
  vFusionId: Joi.string().label("Fusion Id").allow(""),
  vFabricId: Joi.string().label("Fabric Id").allow(""),
  vFabricColor: Joi.string().label("Fabric Color").allow(""),
  vOtherColor: Joi.string().label("Other Color").allow(""),
  vFabricPannaId: Joi.string().label("Fabric Panna Id").allow(""),
  vEmbroideryWorkHeightId: Joi.string()
    .label("Embroidery Work Height")
    .allow(""),
  vFarmaRate: Joi.string().label("Farma Rate").allow(""),
  vFarmaRateWithStoan: Joi.string().label("Farma Rate With Stoan").allow(""),
  vLessBorder: Joi.string().label("Less Border").allow(""),
  vLessBorderWithStoan: Joi.string().label("Less Border With Stoan").allow(""),
  vPlainMeterId: Joi.string().label("Plain Meter").allow(""),
  vPlainMeter: Joi.string().label("Plain Meter").allow(""),
  vFabricPlainIncludedId: Joi.string()
    .label("Fabric Plain Included Id")
    .allow(""),
  iPlainFabricRate: Joi.number().label("Plain Fabric Rate").default(0),
  iProductStatus: Joi.number().label("Product Status").default(1),
  vGroupId: Joi.string().label("Group").allow(""),
  vFabricPlainMeter: Joi.string().label("Fabric Plain Meter").allow(""),
  arrProductUrlImage: Joi.array().label("Product Image Array"),
});

// const updateSchema = Joi.object({
//   vCatalogId: Joi.string().required().label("Catalog Id"),
//   vDesignNumber: Joi.string().label("Design Number"),
//   vFabricId: Joi.string().label("Fabric id"),
//   vFusionId: Joi.string().label("Fusion Id").trim(),
//   vCategoryId: Joi.string().label("Category Id"),
//   vFabricPanna: Joi.string().label("Fabric Panna").trim(),
//   vEmbroideryWorkHeightId: Joi.string().label("Embroidery Work Height"),
//   iFrameNumber: Joi.number().label("Frame Number"),
//   iPlainFabricRate: Joi.number().label("Plain Fabric Rate"),
//   vPlainMeterId: Joi.string().label("Plain Meter"),
//   iFabricSale: Joi.number().label("Fabric Sale"),
//   iProductStatus: Joi.number().label("Product Status"),
//   vGroupId: Joi.string().label("Group").allow(""),
//   arrProductUrlImage: Joi.array().label("Product Image Array"),
// });

module.exports = updateSchema;
