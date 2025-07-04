import type React from "react"
import { Suspense } from "react"
import DonationSuccessClient from "./client"

export default function DonationSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        {/* <DonationSuccessClient /> */}
      </Suspense>
      {children}
    </>
  )
}
