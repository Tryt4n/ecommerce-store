import { Resend } from "resend";
import EmailTemplate from "./EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string) {
  try {
    await resend.emails.send({
      from: `Suport <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Your purchase is complete!",
      react: <EmailTemplate />,
    });
  } catch (error) {
    console.log(`Can't send email. Error: ${error}`);
  }
}
