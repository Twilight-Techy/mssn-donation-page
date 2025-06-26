import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// For preview, we'll use a simplified middleware
export async function middleware(request: NextRequest) {
  // In preview mode, we'll allow all access
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
