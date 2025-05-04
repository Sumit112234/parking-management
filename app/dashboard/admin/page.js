import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { redirect } from "next/navigation"
import AdminStats from "@/components/admin-stats"
import RevenueChart from "@/components/revenue-chart"
import UserManagement from "@/components/user-management"

export default async function AdminDashboard() {
  // Get user from session
  const sessionCookie = cookies().get("session")
  const token = sessionCookie.value
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // Check if user is admin
  if (decoded.role !== "admin") {
    redirect("/dashboard")
  }

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db()

  // Get stats
  const totalSlots = await db.collection("parkingSlots").countDocuments({})
  const availableSlots = await db.collection("parkingSlots").countDocuments({ status: "available" })
  const totalUsers = await db.collection("users").countDocuments({})
  const totalBookings = await db.collection("bookings").countDocuments({})

  // Get revenue data
  const bookings = await db.collection("bookings").find({}).toArray()
  const totalRevenue = bookings.reduce((total, booking) => {
    return total + (booking.fee || 0)
  }, 0)

  // Get monthly revenue data for chart
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = Array(12).fill(0)

  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.createdAt)
    if (bookingDate.getFullYear() === currentYear) {
      const month = bookingDate.getMonth()
      monthlyRevenue[month] += booking.fee || 0
    }
  })

  const revenueData = monthlyRevenue.map((amount, index) => ({
    month: new Date(currentYear, index, 1).toLocaleString("default", { month: "short" }),
    amount,
  }))

  // Get users for management
  const users = await db.collection("users").find({}).sort({ createdAt: -1 }).limit(10).toArray()

  const stats = {
    totalSlots,
    availableSlots,
    totalUsers,
    totalBookings,
    totalRevenue,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <AdminStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagement users={users} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
