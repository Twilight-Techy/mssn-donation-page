"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function DonationFailedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-red-800">Donation Failed</h1>
          <p className="mt-2 text-gray-600">
            We're sorry, but there was an issue processing your donation. No charges have been made to your account.
          </p>

          <div className="mt-6 w-full rounded-lg bg-red-50 p-4">
            <h2 className="font-medium text-red-700">What went wrong?</h2>
            <p className="mt-2 text-sm text-gray-600">This could be due to:</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
              <li>Insufficient funds in your account</li>
              <li>Payment was declined by your bank</li>
              <li>Network or connectivity issues</li>
              <li>Transaction timeout</li>
            </ul>
          </div>

          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
              <Link href="/#donate">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
