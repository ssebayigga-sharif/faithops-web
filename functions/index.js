const { onRequest } = require("firebase-functions/https");
const { setGlobalOptions } = require("firebase-functions");
const admin = require("firebase-admin");
const brevo = require("@getbrevo/brevo");

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
});

exports.sendEmail = onRequest(async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "FaithOps Church",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
