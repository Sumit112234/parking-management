import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Users, Calendar, DollarSign } from "lucide-react"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import BookingChart from "@/components/booking-chart"
import RecentBookings from "@/components/recent-bookings"

export default async function Dashboard() {
  // Get user from session
  const sessionCookie = cookies().get("session")
  const token = sessionCookie.value
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db()

  // Get user data
  const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) })

  // Get stats based on user role
  let stats = {
    totalSlots: 0,
    availableSlots: 0,
    totalBookings: 0,
    revenue: 0,
  }

  let recentBookings = []
  let bookingData = []

  console.log("User role:", user)
  if (user.role === "admin") {
    // Admin sees all stats
    const slots = await db.collection("parkingSlots").find({}).toArray()
    const availableSlots = await db.collection("parkingSlots").countDocuments({ status: "available" })
    const bookings = await db.collection("bookings").find({}).toArray()

    // Calculate revenue
    const revenue = bookings.reduce((total, booking) => {
      return total + (booking.fee || 0)
    }, 0)

    stats = {
      totalSlots: slots.length,
      availableSlots,
      totalBookings: bookings.length,
      revenue,
    }

    // Get recent bookings for admin
    recentBookings = await db.collection("bookings").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    // Get booking data for chart
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      })
      .reverse()

    bookingData = await Promise.all(
      last7Days.map(async (date) => {
        const startOfDay = new Date(date)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const count = await db.collection("bookings").countDocuments({
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        })

        return {
          date,
          count,
        }
      }),
    )
  } else {
    // Regular user sees only their bookings
    const bookings = await db.collection("bookings").find({ userId: decoded.id }).toArray()

    stats = {
      totalBookings: bookings.length,
    }

    // Get recent bookings for user
    recentBookings = await db
      .collection("bookings")
      .find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {user.role === "admin" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSlots}</div>
                <p className="text-xs text-muted-foreground">{stats.availableSlots} available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {/* Placeholder for user count */}
                  {await db.collection("users").countDocuments({})}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
      </div>

      {user.role === "admin" && (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Booking Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BookingChart data={bookingData} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentBookings bookings={recentBookings} />
        </CardContent>
      </Card>
    </div>
  )
}
