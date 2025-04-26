const { Joi } = require("../../../utils/schemaValidate");

const addBannerSchema = Joi.object({
  vName: Joi.string().required().label("Banner Name"),
});

module.exports = addBannerSchema;
