"use server"

interface EmailData {
  email: string
  name: string
  amount: number
  reference: string
  campaign: string
  date: string
}

export async function sendDonationReceipt(data: EmailData) {
  try {
    // For preview, just log the email data
    console.log("Mock: Sending email to", data.email, "with data:", data)

    return { success: true, messageId: "mock-message-id" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
