import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request, { params }) {
  try {
    const { id } = params

    // Get user from session
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Get the booking
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
    })

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    // Check if user is authorized
    if (booking.userId !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Check if booking can be checked out
    if (booking.status !== "active") {
      return NextResponse.json({ message: "Booking cannot be checked out" }, { status: 400 })
    }

    // Calculate actual duration and fee
    const checkedInAt = booking.checkedInAt || booking.startTime
    const checkedOutAt = new Date()
    const actualDurationMs = checkedOutAt - new Date(checkedInAt)
    const actualDurationHours = Math.ceil(actualDurationMs / (1000 * 60 * 60))

    // Get slot to calculate fee
    const slot = await db.collection("parkingSlots").findOne({
      _id: new ObjectId(booking.slotId),
    })

    const actualFee = slot.hourlyRate * actualDurationHours

    // Update booking status
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "completed",
          checkedOut: true,
          checkedOutAt,
          actualDuration: actualDurationHours,
          actualFee,
        },
      },
    )

    // Update slot status back to available
    await db
      .collection("parkingSlots")
      .updateOne({ _id: new ObjectId(booking.slotId) }, { $set: { status: "available" } })

    return NextResponse.json({
      message: "Check-out successful",
      actualFee,
    })
  } catch (error) {
    console.error("Error checking out:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
