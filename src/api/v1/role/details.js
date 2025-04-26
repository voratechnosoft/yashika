const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vRoleId: Joi.string().required().label("Role Id"),
});

module.exports = getDetailSchema;
