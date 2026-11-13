require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,         // Your full Gmail address
    clientId: process.env.CLIENT_ID,      // From Google Cloud Console
    clientSecret: process.env.CLIENT_SECRET, // From Google Cloud Console
    refreshToken: process.env.REFRESH_TOKEN, // The NEW token copied from Step 3
  },
});

module.exports = transporter;

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking Management System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name){
  const subject = `Hello This is Prince Poudel.`;
  const text = `Hello ${name}\\n Thank You for Registration.`;
  const html = `Thank You for creating a gmail:{name}`;

  await sendEmail(userEmail,subject,text,html);
}
module.exports = {sendRegistrationEmail,sendEmail};

