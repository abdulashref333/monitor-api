import EventEmitter from "events";
import sendEmail from "../notifications/email";

const alertEventEmitter = new EventEmitter();

alertEventEmitter.on("alert", (data: any) => {
  setTimeout(async () => {
    // here is the actual notification critria..
    // I'm notifying user only by sending emails, but we can add a slack integration also.
    try {
      sendEmail({
        email: data.email,
        subject: "Alert Notification",
        message: `your ${data.url} check is now down.`,
      });
      console.log("Email send successfully.");
    } catch (error) {
      console.log("Alert Error.", error);
    }
  }, 0);
});
export default alertEventEmitter;
