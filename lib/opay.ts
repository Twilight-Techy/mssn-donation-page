"use client"

import { v4 as uuidv4 } from "uuid"

// Mock implementations for preview
const mockSaveDonationToDatabase = async (data: any) => {
  console.log("Mock: Saving donation to database", data)
  return data
}

const mockUpdateDonationStatus = async (reference: string, status: string) => {
  console.log("Mock: Updating donation status", reference, status)
  return { reference, status }
}

const mockAddSubscriber = async (email: string, name: string) => {
  console.log("Mock: Adding subscriber", email, name)
  return { email, name }
}

const mockSendDonationReceipt = async (data: any) => {
  console.log("Mock: Sending donation receipt", data)
  return { success: true }
}

// This would typically be stored in an environment variable
const OPAY_MERCHANT_ID = process.env.OPAY_MERCHANT_ID || "your_merchant_id"
const OPAY_SECRET_KEY = process.env.OPAY_SECRET_KEY || "your_secret_key"
const OPAY_PUBLIC_KEY = process.env.OPAY_PUBLIC_KEY || "your_public_key"

interface DonationData {
  amount: number
  name: string
  email: string
  phone?: string
  message?: string
  isAnonymous: boolean
  isSubscribed: boolean
  campaign: string
}

interface OpayResponse {
  status: string
  message: string
  data?: {
    cashoutUrl: string
    reference: string
  }
}

export async function initializeOpayPayment(donationData: DonationData): Promise<OpayResponse> {
  try {
    // Generate a unique reference for this transaction
    const reference = `MSSN-OPAY-${uuidv4()}`

    // Store donation data in database (mock for preview)
    await mockSaveDonationToDatabase({
      ...donationData,
      reference,
      paymentMethod: "opay",
      status: "pending",
    })

    // For preview, return a mock response
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/donation/success?reference=${reference}&payment_method=opay`

    return {
      status: "success",
      message: "Payment initialized successfully",
      data: {
        cashoutUrl: `https://cashier.operapay.com/cashier?reference=${reference}&amount=${donationData.amount}&email=${encodeURIComponent(donationData.email)}&callback=${encodeURIComponent(callbackUrl)}`,
        reference,
      },
    }
  } catch (error) {
    console.error("Opay initialization error:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function verifyOpayPayment(reference: string) {
  try {
    // For preview, return a mock response
    await mockUpdateDonationStatus(reference, "completed")

    // Mock sending thank you email
    await mockSendDonationReceipt({
      email: "donor@example.com",
      name: "John Doe",
      amount: 5000,
      reference,
      campaign: "Magazine Launch",
      date: new Date().toISOString(),
    })

    return {
      status: "success",
      message: "Payment verified successfully",
      data: {
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
        reference,
        donationDetails: {
          id: "mock-id",
          reference,
          amount: 5000,
          name: "John Doe",
          email: "donor@example.com",
          phone: "+2341234567890",
          message: "May Allah reward you",
          isAnonymous: false,
          isSubscribed: true,
          campaign: "Magazine Launch",
          paymentMethod: "opay",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }
  } catch (error) {
    console.error("Opay verification error:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// lib/opay.ts
import axios from "axios"

const OPAY_BASE_URL = "https://sandboxapi.opaycheckout.com/api/v3"; // change to live in production

export const initOpayPayment = async (data: {
  amount: number
  reference: string
  customerName: string
  customerEmail: string
  returnUrl: string
}) => {
  const payload = {
    country: "NG",
    currency: "NGN",
    amount: data.amount,
    reference: data.reference,
    productDescription: "Donation",
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    returnUrl: data.returnUrl,
    paymentMethod: "Balance", // or "QrCode", "BankTransfer", "Card" — optional
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/opay/webhook`
  }

  const res = await axios.post(`${OPAY_BASE_URL}/merchant-hosted/payment`, payload, {
    headers: {
      Authorization: `Bearer ${process.env.OPAY_SECRET_KEY}`,
      "Content-Type": "application/json"
    }
  })

  return res.data
}

