"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Edit, Trash, Car, AlertTriangle } from "lucide-react"

export default function ParkingSlotGrid({ slots, isAdmin }) {
  const [filteredSlots, setFilteredSlots] = useState(slots || [])
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    // Listen for filter changes from SlotFilters component
    const handleFiltersChange = (event) => {
      const { type, status } = event.detail

      setSelectedType(type)
      setSelectedStatus(status)

      let filtered = [...slots]

      if (type !== "all") {
        filtered = filtered.filter((slot) => slot.type === type)
      }

      if (status !== "all") {
        filtered = filtered.filter((slot) => slot.status === status)
      }

      setFilteredSlots(filtered)
    }

    window.addEventListener("filtersChange", handleFiltersChange)

    return () => {
      window.removeEventListener("filtersChange", handleFiltersChange)
    }
  }, [slots])

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "maintenance":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getSlotIcon = (status) => {
    switch (status) {
      case "available":
        return null
      case "occupied":
        return <Car className="h-5 w-5" />
      case "reserved":
        return <Car className="h-5 w-5" />
      case "maintenance":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return null
    }
  }

  if (!filteredSlots.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No parking slots found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {filteredSlots.map((slot, index) => (
        <motion.div
          key={slot._id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`border rounded-lg p-4 ${getStatusColor(slot.status)}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{slot.slotNumber}</h3>
              <p className="text-sm capitalize">{slot.type}</p>
            </div>
            {getSlotIcon(slot.status)}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">{slot.status}</span>

            <div className="flex space-x-2">
              {isAdmin ? (
                <>
                  <Link
                    href={`/dashboard/slots/edit/${slot._id}`}
                    className="p-1 rounded-md hover:bg-white hover:bg-opacity-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-1 rounded-md hover:bg-white hover:bg-opacity-50"
                    onClick={() => {
                      // Delete slot functionality
                      if (confirm("Are you sure you want to delete this slot?")) {
                        // Call API to delete slot
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link
                  href={`/dashboard/bookings/create?slotId=${slot._id}`}
                  className={`text-xs inline-flex items-center justify-center rounded-md font-medium h-9 px-3 ${
                    slot.status === "available"
                      ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                      : "bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] opacity-50 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (slot.status !== "available") {
                      e.preventDefault()
                    }
                  }}
                >
                  {slot.status === "available" ? "Book Now" : "Unavailable"}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
