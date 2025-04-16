import transporter from "../config/mailConfig.js";
import resetPasswordTemplate from "./resetPassword.js";
import otpEmailTemplate from "./verifyEmail.js";

const sendOTP = async (username, email, otp, path) => {
  try {
    // Choose the appropriate template based on the path
    const template = path === "verify-email" ? otpEmailTemplate : resetPasswordTemplate;

    // Prepare the email options
    const mailOptions = {
      from: `"Murmur" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: path === "verify-email" ? "Verify Your Email - OTP Inside" : "Reset Your Password - OTP Inside",
      text: `Hello ${username}, your OTP is: ${otp}`, // Plain text fallback
      html: template
        .replace('{{username}}', username)
        .replace('{{otp}}', otp)
        .replace('{{year}}', new Date().getFullYear())
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");

  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

export default sendOTP;
