export default function RecentBookings({ bookings }) {
    if (!bookings || bookings.length === 0) {
      return <div className="text-center py-4 text-gray-500">No recent bookings found.</div>
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
                Date
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
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{booking.slotId}</td>
                <td className="px-6 py-4">{new Date(booking.startTime).toLocaleDateString()}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  