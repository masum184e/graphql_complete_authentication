import nodemailer from 'nodemailer';

const sendEmail = async (recipient, title, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    const mailOptions = {
      to: recipient,
      subject: title,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);    

    return true;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;