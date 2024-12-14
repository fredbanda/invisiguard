"use server";

import transporter from "@/lib/email-sender";

export async function sendRegisterUserEmail(email: string, token: string) {
    console.log(`Sending email to ${email} with token ${token}`);
    
    await transporter.sendMail({
        from: `"Invisiguard Security Solutions" <${process.env.ADMIN_EMAIL_USER}`,
        to: email,
        subject: "Verify your email address",
        html: `
        <div>
        <p>Hi ${email}</p>
        <p>
        <a href="${process.env.AUTH_URL}/auth/register/verify-email?token=${token}">Please Click here to verify your email address</a>
        </p>
        </div>
        `,
    })

    console.log(`Email sent to ${email} with token ${token}`);
    
}