"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Car, Calendar, Users, Settings, LogOut, BarChart4, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function DashboardSidebar({ user }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()

  const isAdmin = user?.role === "admin"

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "user"],
    },
    {
      name: "Parking Slots",
      href: "/dashboard/slots",
      icon: Car,
      roles: ["admin", "user"],
    },
    {
      name: "My Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
      roles: ["admin", "user"],
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart4,
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "user"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role || "user"))

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <motion.aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg md:relative md:translate-x-0 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h2 className="text-xl font-bold text-[rgb(var(--primary))]">ParkEase</h2>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 ${
                        isActive
                          ? "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary))]"
                          : "text-gray-900"
                      }`}
                    >
                      <item.icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-500"}`} />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-6 h-6 text-gray-500" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
