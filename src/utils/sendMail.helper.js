const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const { successAction, failAction } = require("./response");
const Message = require("./messages");

const transport = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (mailOptions) => {
  console.log("sendMail called------------>", process.env.HOST);
  await transport.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log("sendMail error------------>", error);
      return failAction(Message.unexpectedDataError);
    } else {
      console.log("sendMail info response------------>", info.response);
      return successAction({}, `Email sent --------> ${info.response}`);
    }
  });
};
