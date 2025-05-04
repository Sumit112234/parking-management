"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function RevenueChart({ data }) {
  const [chartData, setChartData] = useState([])
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    if (data && data.length > 0) {
      const max = Math.max(...data.map((item) => item.amount))
      setMaxValue(max > 0 ? max : 100) // Default to 100 if all values are 0
      setChartData(data)
    }
  }, [data])

  if (!chartData.length) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>
  }

  return (
    <div className="w-full h-64">
      <div className="flex items-end h-full space-x-2">
        {chartData.map((item, index) => {
          const height = (item.amount / maxValue) * 100

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex justify-center mb-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full max-w-[30px] bg-[rgb(var(--primary))] rounded-t-md relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.amount.toFixed(2)}
                  </div>
                </motion.div>
              </div>
              <div className="text-xs text-gray-500 truncate w-full text-center">{item.month}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
