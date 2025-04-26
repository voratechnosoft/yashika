const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vNotificationId: Joi.string().required().label("Notification Id"),
});
module.exports = deleteSchema;
