import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"

export async function POST(request) {
  try {
    // Get user from session
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 })
    }

    // Get slot data from request
    const slotData = await request.json()

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Check if slot number already exists
    const existingSlot = await db.collection("parkingSlots").findOne({
      slotNumber: slotData.slotNumber,
    })

    if (existingSlot) {
      return NextResponse.json({ message: "Slot number already exists" }, { status: 409 })
    }

    // Create slot
    const slot = {
      ...slotData,
      createdAt: new Date(),
      createdBy: decoded.id,
    }

    // Insert slot
    const result = await db.collection("parkingSlots").insertOne(slot)

    return NextResponse.json(
      {
        message: "Slot created successfully",
        slotId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating slot:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
