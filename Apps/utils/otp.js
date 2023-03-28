const {sendEmail} =  require('../utils/mailer')

//send an OTP to user
const digits = '0123456789';

async function generateOTP(email) {
  let otpCode = '';
  for (let i = 0; i < 6; i++) {
    otpCode += digits[Math.floor(Math.random() * 10)];
  }

  const subject = 'OTP code for registration';
  const text = `Your OTP code is ${otpCode}`;

  await sendEmail(email, subject, text);
  return otpCode;
}

module.exports = { generateOTP };
