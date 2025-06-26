import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-amber-100 p-3">
            <AlertTriangle className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-green-800">Page Not Found</h1>
          <p className="mt-2 text-gray-600">
            We're sorry, but the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
              <Link href="/#donate">Make a Donation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
