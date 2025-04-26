const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vCatalogId: Joi.string().required().label("Catalog Id"),
  vMeter: Joi.string().label("Meter").allow(""),
  vColor: Joi.string().label("Color").allow(""),
  vFabricQuality: Joi.string().label("Fabric Quality").allow(""),
  vFabricPanna: Joi.string().label("Fabric Panna").allow(""),
  vBorder: Joi.string().label("Border").allow(""),
  vExtraPlainFabric: Joi.string().label("Extra Plain Fabric").allow(""),
  vDescription: Joi.string().label("Description").allow(""),
  vFusion: Joi.string().label("Fusion").allow(""),
});

module.exports = saveSchema;
