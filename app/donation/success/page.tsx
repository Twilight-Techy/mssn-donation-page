"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)
  const [donationDetails, setDonationDetails] = useState<{
    reference: string
    amount: string
    campaign: string
    date: string
  } | null>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")
    const paymentMethod = searchParams.get("payment_method") // || "paystack"

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
    const verifyPayment = async () => {
      try {
        setIsVerifying(true)

        const res = await fetch(`/api/verify/${paymentMethod}?reference=${reference}`)
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Payment verification failed")
        }

        const donation = data.donation

        setDonationDetails({
          reference: donation.reference,
          amount: Number(donation.amount).toLocaleString(),
          campaign: donation.campaign?.title || "N/A",
          date: new Date(donation.createdAt).toLocaleDateString(),
        })

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-green-800">Donation Successful!</h1>
          <p className="mt-2 text-gray-600">
            Thank you for your generous donation to the MSSN LASU Epe Chapter. Your contribution will help us achieve
            our goals.
          </p>

          <div className="mt-6 w-full rounded-lg bg-green-50 p-4">
            <h2 className="font-medium text-green-700">Donation Details</h2>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">Reference:</span>
                <span className="font-medium text-gray-700">
                  {isVerifying ? "Processing..." : donationDetails?.reference || "N/A"}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium text-gray-700">
                  ₦{isVerifying ? "Processing..." : donationDetails?.amount || "N/A"}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Campaign:</span>
                <span className="font-medium text-gray-700">{donationDetails?.campaign || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-700">{donationDetails?.date || "N/A"}</span>
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500">A receipt has been sent to your email address.</p>

          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
              <Link href="/#campaigns">View Other Campaigns</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
