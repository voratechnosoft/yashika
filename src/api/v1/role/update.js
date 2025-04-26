const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vRoleId: Joi.string().required().label("Role Id"),
  vName: Joi.string().required().label("Role Name").trim(),
});

module.exports = updateSchema;
