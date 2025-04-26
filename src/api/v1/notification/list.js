const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  vNotificationType: Joi.boolean().label("Notification Type").default(false),
  vSearchText: Joi.string().label("searchText").allow(""),
  iNotificationType: Joi.number().label("iNotificationType").default(0),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = listSchema;
