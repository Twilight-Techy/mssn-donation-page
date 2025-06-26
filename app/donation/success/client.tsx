"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function DonationSuccessClient() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const reference = searchParams.get("reference")
    const paymentMethod = searchParams.get("payment_method") || "paystack"

    if (!reference) {
      toast({
        title: "Missing reference",
        description: "Payment reference not found",
        variant: "destructive",
      })
      setIsVerifying(false)
      return
    }

    // Mock verification for preview
    const mockVerifyPayment = async () => {
      try {
        setIsVerifying(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update the UI with payment details
        const amountElement = document.getElementById("amount")
        const referenceElement = document.getElementById("reference")
        const campaignElement = document.getElementById("campaign")
        const dateElement = document.getElementById("date")

        if (amountElement) {
          amountElement.textContent = `₦5,000`
        }

        if (referenceElement) {
          referenceElement.textContent = reference
        }

        if (campaignElement) {
          campaignElement.textContent = "Magazine Launch"
        }

        if (dateElement) {
          dateElement.textContent = new Date().toLocaleDateString()
        }

        toast({
          title: "Payment Verified",
          description: "Your donation has been verified successfully",
        })
      } catch (error) {
        console.error("Payment verification error:", error)
        toast({
          title: "Verification Error",
          description: "An error occurred while verifying your payment",
          variant: "destructive",
        })
      } finally {
        setIsVerifying(false)
      }
    }

    mockVerifyPayment()
  }, [searchParams, toast])

  return null
}
