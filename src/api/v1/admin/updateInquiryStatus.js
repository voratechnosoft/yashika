const { Joi } = require("../../../utils/schemaValidate");

const userInquiryRequestSchema = Joi.object({
  vInquiryId: Joi.string().required().label("Inquiry Id"),
  vDate: Joi.string().label("Date").allow(""),
  vReason: Joi.string().label("Reason").allow(""),
  updateInquiryStatus: Joi.number().required().label("Update Inquiry Status"),
});

module.exports = userInquiryRequestSchema;
