import ejs from "ejs";
import nodemailer from "nodemailer";
import ApiError from "../utils/apiError.js";

// Render Email Template
const renderEmailTemplate = async (templatePath, data) => {
  try {
    const renderedTemplate = await ejs.renderFile(templatePath, data);
    return renderedTemplate;
  } catch (error) {
    throw new Error(`Error rendering email template: ${error.message}`);
  }
};

// Transporter (Setting up SMTP details)
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Sending Password Reset Email
export const sendPasswordResetEmail = async (
  sendTo,
  username,
  resetPasswordCode
) => {
  const appUrl = `http://localhost:8000`;

  const passwordResetData = {
    email: sendTo,
    username,
    resetLink: `${appUrl}/api/users/forgot-password-request?token=${resetPasswordCode}`,
  };

  try {
    const emailTemplate = await renderEmailTemplate(
      "src/templates/emailer/password-reset.ejs",
      passwordResetData
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sendTo,
      subject: "Project Management System - Reset Your Password",
      html: emailTemplate,
    });
    return info;
  } catch (error) {
    throw new ApiError(500, `Error sending Email :: ${error}`);
  }
};
