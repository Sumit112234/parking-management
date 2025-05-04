import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Get all available slots
    const slots = await db.collection("parkingSlots").find({ status: "available" }).toArray()

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
