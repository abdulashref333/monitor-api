import nodemailer from "nodemailer";

interface IEmailMessage {
  email: string;
  subject: string;
  message?: string;
  html?: any;
}

const sendEmail = (options: IEmailMessage) => {
  setTimeout(async () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME || "abdul.ashref333@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "aaohlylvktoohmqa",
      },
    });

    const mailOptions = {
      from: "Test User <gsoftSome@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully.");
    } catch (error) {
      console.error(`Email Errror: ${options.email} doesn't recieve the mail.`);
    }
  }, 0);
};

export default sendEmail;
