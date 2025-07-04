import { Loader2 } from "lucide-react"

export default function Loader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50">
      <Loader2 className="h-10 w-10 animate-spin text-green-600" />
    </div>
  )
}
