import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Get user from session
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Check if user exists
    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent deleting self
    if (user._id.toString() === decoded.id) {
      return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 })
    }

    // Delete user
    await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params

    // Get user from session
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = sessionCookie.value
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user is admin or the user themselves
    if (decoded.role !== "admin" && decoded.id !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get user data from request
    const userData = await request.json()

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Check if user exists
    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData = {}

    if (userData.name) updateData.name = userData.name
    if (userData.email) updateData.email = userData.email

    // Only admin can change roles
    if (userData.role && decoded.role === "admin") {
      updateData.role = userData.role
    }

    // Update user
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
