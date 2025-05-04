import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request) {
  try {
    // Get user from session
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get booking data from request
    const { slotId, startTime, duration } = await request.json()

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Get the slot
    const slot = await db.collection("parkingSlots").findOne({
      _id: new ObjectId(slotId),
    })

    if (!slot) {
      return NextResponse.json({ message: "Parking slot not found" }, { status: 404 })
    }

    if (slot.status !== "available") {
      return NextResponse.json({ message: "Parking slot is not available" }, { status: 400 })
    }

    // Calculate end time and fee
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(startTime)
    endDateTime.setHours(endDateTime.getHours() + duration)

    const fee = slot.hourlyRate * duration

    // Create booking
    const booking = {
      userId: decoded.id,
      slotId,
      startTime: startDateTime,
      endTime: endDateTime,
      duration,
      fee,
      status: "pending",
      createdAt: new Date(),
    }

    // Insert booking
    const result = await db.collection("bookings").insertOne(booking)

    // Update slot status to reserved
    await db.collection("parkingSlots").updateOne({ _id: new ObjectId(slotId) }, { $set: { status: "reserved" } })

    return NextResponse.json(
      {
        message: "Booking created successfully",
        bookingId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
