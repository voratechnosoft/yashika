const axios = require("axios");
const Message = require("./messages");

const sendOTPByWhatsapp = async (message, mobileNumber) => {
  try {
    const whatsappApi = process.env.WP_THIRD_PARTY_API;
    const apiKey = process.env.WP_API_KEY;

    if (message === "" || mobileNumber === "") {
      return {
        code: 400,
        errors: Message.mobileAndMessageRequired,
      };
    }

    const response = await axios.post(
      whatsappApi,
      {
        to: mobileNumber,
        message_object: {
          text: message,
        },
        type: "TEXT",
      },
      {
        headers: {
          "Content-Type": "application/json",
          swa_token: apiKey, // Sending API key in the "swa_token" header
        },
      }
    );

    return response.data;
  } catch (error) {
    let errorMessage = error.response ? error.response.data : error.message;
    console.error("Error sending message:", errorMessage);
    return {
      code: 400,
      errors: Message.otpSendError,
    };
  }
};

module.exports = { sendOTPByWhatsapp };
