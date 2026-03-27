// // utils/sendMail.js
// import nodemailer from "nodemailer";
// import { config } from "../config/keys.js";

// const canSendEmail = process.env.NODE_ENV === "production" || process.env.ENABLE_EMAIL_SENDING === "true";

// const sendSupportMail = async ({ name, email, message }) => {
//   if (!isProd) {
//     console.log("sendSupportMail skipped (NODE_ENV != production)");
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: config.supportEmail,
//       pass: config.supportEmailPass,
//     },
//   });

//   await transporter.sendMail({
//     from: config.supportEmail,
//     to: config.supportEmail,
//     subject: `New Query from ${name}`,
//     html: `
//       <h3>Sender: ${name}</h3>
//       <p>Email: ${email}</p>
//       <p>Message: ${message}</p>
//     `,
//   });
// };

// export async function sendMail({ to, subject, html }) {
//   if (!canSendEmail) {
//     console.log("sendMail skipped. Set ENABLE_EMAIL_SENDING=true to send emails in development");
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST || "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Daksh Team" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// }

// export default sendSupportMail;



// // Check both NODE_ENV and a separate flag
