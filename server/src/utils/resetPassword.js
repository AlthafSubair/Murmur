const resetPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f8fa;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      padding: 30px;
      margin: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .otp-box {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 5px;
      text-align: center;
      background-color: #f0f4f8;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      color: #1a73e8;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello {{username}},</h2>
    <p>We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
    <div class="otp-box">{{otp}}</div>
    <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <div class="footer">
      &copy; {{year}} Murmur. All rights reserved.
    </div>
  </div>
</body>
</html>

`;

export default resetPasswordTemplate;