const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vNotificationId: Joi.string().required().label("Notification Id"),
});

module.exports = updateSchema;
