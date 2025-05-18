import React from "react"
import { motion } from "framer-motion"

const categories = [
  "all",
  "Alkali Metal",
  "Alkaline Earth Metal",
  "Transition Metal",
  "Post-Transition Metal",
  "Metalloid",
  "Nonmetal",
  "Halogen",
  "Noble Gas",
]

export default function Filters({ onFilterChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <select
        className="w-full px-4 py-3 rounded-xl border-white text-white
                   border-2 border-transparent cursor-pointer appearance-none font-semibold
                   focus:border-white focus:ring-2 focus:ring-white/20
                   transition-all duration-200"
        onChange={(e) => onFilterChange(e.target.value)}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
          paddingRight: '2.5rem',
          backgroundColor: 'black',
          color: 'white',
        }}
      >
        {categories.map((category) => (
          <option
            key={category}
            value={category.toLowerCase()}
            className="text-white bg-black"
          >
            {category === "all" ? "All Categories" : category}
          </option>
        ))}
      </select>
    </motion.div>
  )
}
