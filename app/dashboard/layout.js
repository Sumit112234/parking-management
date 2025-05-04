import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export default async function DashboardLayout({ children }) {
  // Server-side authentication check
  const sessionCookie = await cookies().get("session")

  if (!sessionCookie) {
    redirect("/login")
  }

  try {
    // Verify the JWT token
    const token = sessionCookie.value
    const user = jwt.verify(token, process.env.JWT_SECRET)

    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader user={user} />
        <div className="flex">
          <DashboardSidebar user={user} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard layout error:", error)
    redirect("/login")
  }
}
