import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import ParkingSlotGrid from "@/components/parking-slot-grid"
// import SlotFilters from "@/components/slot-filters"
import SlotFilters from "@/components/slot-filter"

export default async function SlotsPage() {
  // Get user from session
  const sessionCookie = cookies().get("session")
  const token = sessionCookie.value
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db()

  // Get all parking slots
  const slots = await db.collection("parkingSlots").find({}).toArray()

  // Get slot types for filter
  const slotTypes = [...new Set(slots.map((slot) => slot.type))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Parking Slots</h1>

        {decoded.role === "admin" && (
          <a href="/dashboard/slots/create" className="btn btn-primary btn-default mt-4 md:mt-0">
            Add New Slot
          </a>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <SlotFilters slotTypes={slotTypes} />
          <ParkingSlotGrid slots={slots} isAdmin={decoded.role === "admin"} />
        </CardContent>
      </Card>
    </div>
  )
}
