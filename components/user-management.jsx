"use client"

import { useState } from "react"
import { Edit, Trash, UserPlus } from "lucide-react"
import Link from "next/link"

export default function UserManagement({ users }) {
  const [currentUsers, setCurrentUsers] = useState(users || [])

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      // Remove user from the UI
      setCurrentUsers((prev) => prev.filter((user) => user._id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    }
  }

  if (!currentUsers.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No users found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard/admin/users/create"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-3">
                Email
              </th>
              <th scope="col" className="px-4 py-3">
                Role
              </th>
              <th scope="col" className="px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/admin/users/edit/${user._id}`}
                      className="p-1 rounded-md hover:bg-gray-100"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
