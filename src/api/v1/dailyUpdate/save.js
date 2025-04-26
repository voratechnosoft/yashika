const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vMachinId: Joi.string().required().label("Machin Id"),
  vWorkerId: Joi.string().required().label("Worker Id"),
  vWorkingTime: Joi.string().required().label("Working Time"),
  vWorkingDay: Joi.string().required().label("Working Day"),
  vMachineCondition: Joi.string().required().label("Machine Condition"),
  vDescription: Joi.string().label("Description").allow(""),
  iFrame: Joi.number().required().label("Frame"),
  iThreadBreak: Joi.number().required().label("Thread Break"),
  iCurrentStitch: Joi.number().required().label("Current Stitch"),
  iRunningStitch: Joi.number().required().label("Running Stitch"),
  iDesignNumber: Joi.number().required().label("Design Number"),
  iStopTimeHours: Joi.number().required().label("Stop Time Hours"),
  iStopTimeMinute: Joi.number().required().label("Stop Time Minute"),
  vDate: Joi.string().label("Date").allow(""),
});

module.exports = saveSchema;
