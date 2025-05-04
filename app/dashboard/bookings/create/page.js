"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreateBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slotIdFromQuery = searchParams.get("slotId")

  const [availableSlots, setAvailableSlots] = useState([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)
  const [formData, setFormData] = useState({
    slotId: slotIdFromQuery || "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    duration: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch available slots
    const fetchSlots = async () => {
      try {
        const response = await fetch("/api/slots/available")

        if (!response.ok) {
          throw new Error("Failed to fetch available slots")
        }

        const data = await response.json()
        setAvailableSlots(data.slots)
      } catch (err) {
        console.error("Error fetching slots:", err)
        setError("Failed to load available slots")
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number.parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`)
      
      console.log(formData, "formData")
      const bookingData = {
        slotId: formData.slotId,
        startTime: startDateTime.toISOString(),
        duration: formData.duration,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking")
      }

      router.push("/dashboard/bookings")
    } catch (err) {
      setError(err.message || "An error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/bookings" className="btn btn-ghost btn-sm mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">Create New Booking</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>

          {error && (
            <div className="px-6 -mt-4 mb-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slotId" className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Slot *
                  </label>
                  {isLoadingSlots ? (
                    <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                  ) : (
                    <select
                      id="slotId"
                      name="slotId"
                      required
                      className="input"
                      value={formData.slotId}
                      onChange={handleChange}
                    >
                      <option value="">Select a parking slot</option>
                      {availableSlots.map((slot) => (
                        <option key={slot._id} value={slot._id}>
                          {slot.slotNumber} - {slot.type} (${slot.hourlyRate}/hour)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    required
                    className="input"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours) *
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    required
                    className="input"
                    value={formData.duration}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} {hours === 1 ? "hour" : "hours"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Booking fee will be calculated based on the slot's hourly rate and your
                  selected duration.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isLoading || isLoadingSlots}
                className="bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <Calendar className="h-5 w-5 mr-2" />
                )}
                Create Booking
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
