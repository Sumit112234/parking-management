import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ user: null })
    }

    // Verify the JWT token
    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
