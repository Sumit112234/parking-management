import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import Link from "next/link"
import { Plus } from "lucide-react"
import BookingList from "@/components/booking-list"

export default async function BookingsPage() {
  // Get user from session
  const sessionCookie = cookies().get("session")
  const token = sessionCookie.value
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db()

  // Get bookings based on user role
  let bookings = []

  if (decoded.role === "admin") {
    // Admin sees all bookings
    bookings = await db.collection("bookings").find({}).sort({ createdAt: -1 }).toArray()
  } else {
    // Regular user sees only their bookings
    bookings = await db.collection("bookings").find({ userId: decoded.id }).sort({ createdAt: -1 }).toArray()
  }

  // Populate slot information for each booking
  const bookingsWithSlotInfo = await Promise.all(
    bookings.map(async (booking) => {
      const slot = await db.collection("parkingSlots").findOne({
        _id: new ObjectId(booking.slotId),
      })

      return {
        ...booking,
        slotInfo: slot,
      }
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>

        <Link
          href="/dashboard/bookings/create"
          className="btn btn-primary btn-default mt-4 md:mt-0 inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Booking
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingList bookings={bookingsWithSlotInfo} isAdmin={decoded.role === "admin"} />
        </CardContent>
      </Card>
    </div>
  )
}
