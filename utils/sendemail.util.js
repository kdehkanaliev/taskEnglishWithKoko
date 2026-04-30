import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "simpleteam1303@gmail.com",
    pass: "hocg tkkk yufi ghqy",
  },
});

export async function sendEmail(email, link) {
  await transporter.sendMail({
    to: email,
    subject: "Workspace Invite",
    html: `
      <h2>You are invited to a workspace</h2>
      <p>Click below to join:</p>
      <a href="${link}" 
         style="padding:10px 20px; background:blue; color:white; text-decoration:none;">
         Accept Invite
      </a>
    `,
  });
}
