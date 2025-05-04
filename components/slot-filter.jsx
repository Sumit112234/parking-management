"use client"

import { useState } from "react"

export default function SlotFilters({ slotTypes }) {
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")

  const handleTypeChange = (e) => {
    setType(e.target.value)
    dispatchFiltersEvent(e.target.value, status)
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    dispatchFiltersEvent(type, e.target.value)
  }

  const dispatchFiltersEvent = (typeValue, statusValue) => {
    const event = new CustomEvent("filtersChange", {
      detail: {
        type: typeValue,
        status: statusValue,
      },
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/2">
        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Slot Type
        </label>
        <select
          id="type-filter"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={type}
          onChange={handleTypeChange}
        >
          <option value="all">All Types</option>
          {slotTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-1/2">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select id="status-filter" className="input" value={status} onChange={handleStatusChange}>
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
    </div>
  )
}
