const { Joi } = require("../../../utils/schemaValidate");

const updateUserSchema = Joi.object({
  vName: Joi.string().required().label("Name"),
});

module.exports = updateUserSchema;
