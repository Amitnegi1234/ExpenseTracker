
const axios = require("axios");

const sendEmail = async (to, subject, message) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Expense Tracker",
                    email: process.env.BREVO_SENDER_EMAIL
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: message
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.log("BREVO ERROR:", error.response?.data);
        console.log("STATUS:", error.response?.status);

        throw error;
    }
};

module.exports = sendEmail;
