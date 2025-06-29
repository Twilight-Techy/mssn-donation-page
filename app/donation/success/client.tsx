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

    const verifyPayment = async () => {
      try {
        setIsVerifying(true)

        const res = await fetch(`/api/verify/${paymentMethod}?reference=${reference}`)
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Verification failed")
        }

        const donation = data.donation

        // Update the UI with payment details
        const amountElement = document.getElementById("amount")
        const referenceElement = document.getElementById("reference")
        const campaignElement = document.getElementById("campaign")
        const dateElement = document.getElementById("date")

        if (amountElement) {
          amountElement.textContent = `₦${Number(donation.amount).toLocaleString()}`
        }

        if (referenceElement) {
          referenceElement.textContent = donation.reference
        }

        if (campaignElement) {
          campaignElement.textContent = donation.campaign?.title || "N/A"
        }

        if (dateElement) {
          dateElement.textContent = new Date(donation.createdAt).toLocaleDateString()
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

    verifyPayment()
  }, [searchParams, toast])

  return null
}
