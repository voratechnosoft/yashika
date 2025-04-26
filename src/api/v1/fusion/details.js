const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vFusionId: Joi.string().required().label("Fusion"),
});

module.exports = getDetailSchema;
