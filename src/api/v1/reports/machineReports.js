const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  dtStart: Joi.string().required().label("dtStart"),
  dtEnd: Joi.string().required().label("dtEnd"),
  vMachineId: Joi.string().required().label("vMachineId"),
});

module.exports = listSchema;
