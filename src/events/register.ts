import { database } from "agenda/dist/agenda/database";
import EventEmitter from "events";
import path from "path";
import sendEmail from "../alerts/email";
const ejs = require("ejs");

const registerEventEmitter = new EventEmitter();

registerEventEmitter.on("register", (data: any) => {
  setTimeout(async () => {
    try {
      const templatePath = path.join(
        __dirname,
        "../templates/sendRegisterationEmail.ejs"
      );

      const link = `http://localhost:${process.env.PORT}/api/users/verify?token=${data.id}`;
      const html = await ejs.renderFile(templatePath, {
        name: data.name,
        link,
      });

      sendEmail({
        email: data.email,
        subject: "Registeration Email",
        html,
      });
      console.log("Email send successfully.");
    } catch (error) {
      console.log("Register Event Error.", error);
    }
  }, 0);
});
export default registerEventEmitter;
