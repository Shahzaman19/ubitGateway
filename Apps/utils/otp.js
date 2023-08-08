const { sendEmail } = require('../utils/mailer');

// Send an OTP to the user
const digits = '0123456789';

async function generateOTP(email) {
  let otpCode = '';
  for (let i = 0; i < 4; i++) {
    otpCode += digits[Math.floor(Math.random() * 10)];
  }

  const subject = 'OTP code for registration';
  const text = `Your OTP code is ${otpCode}`;

  await sendEmail(email, subject, text);
  // console.log("otpCode ------------------>",otpCode);
  return otpCode;
}

module.exports = { generateOTP};
