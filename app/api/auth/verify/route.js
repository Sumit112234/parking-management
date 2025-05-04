import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ valid: false })
    }

    // Verify the JWT token
    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return NextResponse.json({ valid: true, user: decoded })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ valid: false })
  }
}
