import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PeriodicTable from "./components/PeriodicTable"
import ElementDetails from "./components/ElementDetails"
import Filters from "./components/Filters"
import SearchBar from "./components/SearchBar"
import LoadingSpinner from "./components/LoadingSpinner"
import elements from "./data/elements"

const categoryColors = {
  "Alkali Metal": "rgb(100, 27, 137)",
  "Alkaline Earth Metal": "rgb(82, 81, 88)",
  "Transition Metal": "rgb(57, 83, 57)",
  "Post-Transition Metal": "rgb(103, 62, 62)",
  Metalloid: "rgb(51, 58, 119)",
  Nonmetal: "rgb(34, 84, 87)",
  Halogen: "rgb(124, 1, 109)",
  "Noble Gas": "rgb(21, 61, 121)",
  Lanthanide: "rgb(112, 97, 45)",
  Actinide: "rgb(4, 64, 108)",
}

// Helper function to lighten an RGBA color
function lightenRgba(rgba, amount = 30) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)\)/)
  if (!match) return rgba
  const [, r, g, b, a] = match.map(Number)
  const newR = Math.min(r + amount, 255)
  const newG = Math.min(g + amount, 255)
  const newB = Math.min(b + amount, 255)
  return `rgba(${newR}, ${newG}, ${newB}, ${a || 1})`
}

export default function App() {
  const [selectedElement, setSelectedElement] = useState(null)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [colorScheme, setColorScheme] = useState("default")

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleElementClick = (element) => {
    const baseColor =
      colorScheme === "default"
        ? categoryColors[element.category] || "rgba(229, 231, 235, 1)"
        : `rgba(${element.atomicNumber % 255}, 100, 200, 1)`

    
    const leftsidecolor = lightenRgba(baseColor, 60)
    setSelectedElement({ ...element, baseColor, leftsidecolor })
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const handleSearchChange = (query) => {
    setSearch(query)
  }

  const handleCloseModal = () => {
    setSelectedElement(null)
  }

  const filteredElements = elements.filter((element) => {
    const matchesFilter = filter === "all" || element.category.toLowerCase() === filter.toLowerCase()
    const matchesSearch =
      element.name.toLowerCase().includes(search.toLowerCase()) ||
      element.symbol.toLowerCase().includes(search.toLowerCase()) ||
      element.atomicNumber.toString().includes(search)
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen w-full  transition-colors duration-200">



      
      <div className="min-h-screen w-full p-4  transition-colors duration-200">

      <div className="w-full flex justify-center bg-black text-white py-12 px-4">
  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left max-w-5xl">
    <h1 className="text-4xl sm:text-5xl font-light">
      the <span className="italic font-semibold">periodic table</span>
    </h1>
    <div className="border-l border-gray-600 pl-6 text-gray-300 text-base sm:text-lg max-w-xl">
      The periodic table is a tabular arrangement of chemical elements, organized by atomic number, electron configuration,
      and recurring chemical properties, providing a framework for understanding the relationships and trends among elements.
    </div>
  </div>
</div>


        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={"table"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full">
              <div className="mb-4 flex flex-col sm:flex-row gap-2">
     <SearchBar onSearchChange={handleSearchChange} />
<Filters onFilterChange={handleFilterChange} />
                  
</div>
                <PeriodicTable
                  elements={filteredElements}
                  onElementClick={handleElementClick}
                  colorScheme={colorScheme}
                />
                
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Modal - Updated width/height here */}
        <AnimatePresence>
          {selectedElement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="rounded-xl shadow-2xl max-w-[1100px] w-full max-h-[80vh] overflow-y-auto relative" // Changed here
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: selectedElement.baseColor || 'white',
                  color: selectedElement.leftsidecolor || 'black',
                }}
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-black"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <ElementDetails element={selectedElement} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
