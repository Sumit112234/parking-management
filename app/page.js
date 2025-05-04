"use client"

import Link from "next/link"
import { Car, User, Calendar, BarChart4 } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[rgb(var(--primary))] text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ParkEase</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-white text-[rgb(var(--primary))]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-white text-white hover:bg-accent hover:text-accent-foreground"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-[rgb(var(--primary))] to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Smart Parking Management System</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Efficiently manage parking spaces, reduce congestion, and improve the parking experience.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-white text-[rgb(var(--primary))] hover:bg-gray-100"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Car className="h-10 w-10 text-[rgb(var(--primary))]" />,
                  title: "Slot Management",
                  description: "Easily manage parking slots, set types, and monitor availability.",
                },
                {
                  icon: <User className="h-10 w-10 text-[rgb(var(--primary))]" />,
                  title: "User Authentication",
                  description: "Secure login for both administrators and regular users.",
                },
                {
                  icon: <Calendar className="h-10 w-10 text-[rgb(var(--primary))]" />,
                  title: "Booking System",
                  description: "Book, cancel, and manage parking reservations with ease.",
                },
                {
                  icon: <BarChart4 className="h-10 w-10 text-[rgb(var(--primary))]" />,
                  title: "Analytics Dashboard",
                  description: "Comprehensive insights into parking usage and revenue.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="card p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">ParkEase</h2>
              <p className="text-gray-400">Smart Parking Management System</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="hover:text-[rgb(var(--primary))]">
                About
              </Link>
              <Link href="/contact" className="hover:text-[rgb(var(--primary))]">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-[rgb(var(--primary))]">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ParkEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
