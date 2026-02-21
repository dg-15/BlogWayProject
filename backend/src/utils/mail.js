import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const transporter = {
  sendMail: async (mailOptions) => {
    await resend.emails.send({
      from: "BlogWay <onboarding@resend.dev>",
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
  },
};
