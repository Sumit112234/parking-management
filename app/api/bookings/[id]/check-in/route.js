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

    // Check if booking can be checked in
    if (booking.status !== "pending" && booking.status !== "reserved") {
      return NextResponse.json({ message: "Booking cannot be checked in" }, { status: 400 })
    }

    // Update booking status
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "active",
          checkedIn: true,
          checkedInAt: new Date(),
        },
      },
    )

    // Update slot status to occupied
    await db
      .collection("parkingSlots")
      .updateOne({ _id: new ObjectId(booking.slotId) }, { $set: { status: "occupied" } })

    return NextResponse.json({ message: "Check-in successful" })
  } catch (error) {
    console.error("Error checking in:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
