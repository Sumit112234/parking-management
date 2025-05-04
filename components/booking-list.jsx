"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Trash, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function BookingList({ bookings, isAdmin }) {
  const [currentBookings, setCurrentBookings] = useState(bookings || [])

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      // Update the booking status in the UI
      setCurrentBookings((prev) =>
        prev.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking. Please try again.")
    }
  }

  const handleCheckIn = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/check-in`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to check in")
      }

      // Update the booking status in the UI
      setCurrentBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "active", checkedIn: true } : booking,
        ),
      )
    } catch (error) {
      console.error("Error checking in:", error)
      alert("Failed to check in. Please try again.")
    }
  }

  const handleCheckOut = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/check-out`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to check out")
      }

      // Update the booking status in the UI
      setCurrentBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "completed", checkedOut: true } : booking,
        ),
      )
    } catch (error) {
      console.error("Error checking out:", error)
      alert("Failed to check out. Please try again.")
    }
  }

  if (!currentBookings.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No bookings found.</p>
        <Link href="/dashboard/bookings/create" className="btn btn-primary btn-default">
          Create a Booking
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Slot
            </th>
            <th scope="col" className="px-6 py-3">
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3">
              Duration
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Fee
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking, index) => (
            <motion.tr
              key={booking._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium">{booking.slotInfo?.slotNumber || booking.slotId}</td>
              <td className="px-6 py-4">{new Date(booking.startTime).toLocaleString()}</td>
              <td className="px-6 py-4">
                {booking.duration} {booking.duration === 1 ? "hour" : "hours"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "active"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4">${booking.fee?.toFixed(2) || "0.00"}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/bookings/${booking._id}`}
                    className="p-1 rounded-md hover:bg-gray-100"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  {booking.status === "pending" && (
                    <button
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => handleCancelBooking(booking._id)}
                      title="Cancel Booking"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}

                  {(booking.status === "pending" || booking.status === "reserved") && !booking.checkedIn && (
                    <button
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => handleCheckIn(booking._id)}
                      title="Check In"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}

                  {booking.status === "active" && !booking.checkedOut && (
                    <button
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => handleCheckOut(booking._id)}
                      title="Check Out"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
