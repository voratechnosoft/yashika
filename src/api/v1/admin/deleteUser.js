const { Joi } = require("../../../utils/schemaValidate");

const deleteUserSchema = Joi.object({
  vUserId: Joi.string().required().label("User Id"),
});

module.exports = deleteUserSchema;
