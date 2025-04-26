const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  arrMachinId: Joi.array().label("Machin Id Array"),
  arrWorkerId: Joi.array().label("Worker Id Array"),
  arrWorkingTime: Joi.array().label("Working Time Array"),
  dtStart: Joi.string().label("dtStart").allow(""),
  dtEnd: Joi.string().label("dtEnd").allow(""),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = listSchema;
