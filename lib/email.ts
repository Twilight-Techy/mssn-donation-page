import nodemailer from "nodemailer"

interface DonationReceipt {
  email: string
  name: string
  amount: number
  reference: string
  campaign: string
  date: string
}

export async function sendDonationReceipt(receipt: DonationReceipt) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: `"MSSN LASU Epe" <${process.env.SMTP_USER}>`,
    to: receipt.email,
    subject: "Your Donation Receipt",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 1rem; background: #f9f9f9;">
        <h2 style="color: #16a34a;">Thank You for Your Donation!</h2>
        <p>Dear ${receipt.name},</p>
        <p>Thank you for your kind donation to <strong>MSSN LASU Epe Chapter</strong>.</p>
        <p><strong>Donation Details:</strong></p>
        <ul>
          <li><strong>Reference:</strong> ${receipt.reference}</li>
          <li><strong>Amount:</strong> ₦${Number(receipt.amount).toLocaleString()}</li>
          <li><strong>Campaign:</strong> ${receipt.campaign}</li>
          <li><strong>Date:</strong> ${new Date(receipt.date).toLocaleDateString()}</li>
        </ul>
        <p>May Allah reward you abundantly.</p>
        <p>Wassalam,<br>MSSN LASU Epe Team</p>
      </div>
    `,
  }

  const result = await transporter.sendMail(mailOptions)

  return result
}
