import React, { useCallback } from "react"
import { motion } from "framer-motion"
import ElementTile from "./ElementTile"

export default function PeriodicTable({ elements, onElementClick, colorScheme }) {
  const tableLayout = Array(10)
    .fill()
    .map(() => Array(19).fill(null))

  elements.forEach((element) => {
    const row = getRowForElement(element.atomicNumber)
    const col = getColForElement(element.atomicNumber)
    if (row !== -1 && col !== -1) {
      tableLayout[row][col] = element
    }
  })

  const handleKeyDown = useCallback(
    (event, element) => {
      if (event.key === "Enter" || event.key === " ") {
        onElementClick(element)
      }
    },
    [onElementClick],
  )

  const lanthanides = elements.filter(el => el.atomicNumber >= 57 && el.atomicNumber <= 71)
  const actinides = elements.filter(el => el.atomicNumber >= 89 && el.atomicNumber <= 103)

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
      <div className="min-w-[1200px] p-4 rounded-xl shadow-lg">

        {/* Main Periodic Table Grid */}
        <div 
          className="grid gap-1 mb-8" 
          style={{ 
            gridTemplateColumns: 'repeat(19, minmax(60px, 1fr))',
            gridTemplateRows: 'repeat(7, minmax(60px, 1fr))'
          }}
          role="grid" 
          aria-label="Periodic Table"
        >
          {tableLayout.flat().map((element, index) => (
            <div 
              key={index} 
              className={element ? "" : "invisible"} 
              role="gridcell"
              style={{
                gridColumn: element ? getColForElement(element.atomicNumber) + 1 : 'auto',
                gridRow: element ? getRowForElement(element.atomicNumber) + 1 : 'auto'
              }}
            >
              {element && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <ElementTile
  element={{
    ...element,
  }}
  label={
    element.atomicNumber === 57
      ? "57–71"
      : element.atomicNumber === 89
      ? "89–103"
      : null
  }
  onClick={() => onElementClick(element)}
  onKeyDown={(e) => handleKeyDown(e, element)}
  colorScheme={colorScheme}
  tabIndex={0}
/>

                </motion.div>
              )}
            </div>
          ))}
        </div>

 {/* Lanthanides and Actinides Rows */}
{/* Lanthanides and Actinides Rows */}
<div
  className="grid gap-1 mt-4"
  style={{
    gridTemplateColumns: 'repeat(19, minmax(60px, 1fr))',
    gridTemplateRows: 'repeat(2, minmax(60px, 1fr))'
  }}
  role="grid"
  aria-label="Lanthanides and Actinides Rows"
>
  {/* Lanthanides label */}
  <div
    className="flex justify-end items-center pr-2"
    style={{
      gridColumn: '2 / 3',
      gridRow: '1'
    }}
  >
    
  </div>

  {/* Lanthanides row */}
  {lanthanides.map((element, index) => (
    <div
      key={element.atomicNumber}
      style={{
        gridColumn: `${4 + index} / ${5 + index}`,
        gridRow: '1'
      }}
      role="gridcell"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <ElementTile
          element={element}
          onClick={() => onElementClick(element)}
          onKeyDown={(e) => handleKeyDown(e, element)}
          colorScheme={colorScheme}
          tabIndex={0}
        />
      </motion.div>
    </div>
  ))}

  {/* Actinides label */}
  <div
    className="flex justify-end items-center pr-2"
    style={{
      gridColumn: '2 / 3',
      gridRow: '2'
    }}
  >
    
  </div>

  {/* Actinides row */}
  {actinides.map((element, index) => (
    <div
      key={element.atomicNumber}
      style={{
        gridColumn: `${4 + index} / ${5 + index}`,
        gridRow: '2'
      }}
      role="gridcell"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <ElementTile
          element={element}
          onClick={() => onElementClick(element)}
          onKeyDown={(e) => handleKeyDown(e, element)}
          colorScheme={colorScheme}
          tabIndex={0}
        />
      </motion.div>
    </div>
  ))}
</div>


      </div>
    </div>
  )
}

function getRowForElement(atomicNumber) {
  if (atomicNumber <= 2) return 0;
  if (atomicNumber <= 10) return 1;
  if (atomicNumber <= 18) return 2;
  if (atomicNumber <= 36) return 3;
  if (atomicNumber <= 54) return 4;
  if (atomicNumber <= 86) return 5;
  if (atomicNumber <= 118) return 6;
  if (atomicNumber >= 57 && atomicNumber <= 71) return 8;
  if (atomicNumber >= 89 && atomicNumber <= 103) return 9;
  return -1;
}

function getColForElement(atomicNumber) {
  if (atomicNumber === 1) return 0;
  if (atomicNumber === 2) return 18;
  if ([3, 11, 19, 37, 55, 87].includes(atomicNumber)) return 0;
  if ([4, 12, 20, 38, 56, 88].includes(atomicNumber)) return 1;
  if ([5, 13, 31, 49, 81, 113].includes(atomicNumber)) return 13;
  if ([6, 14, 32, 50, 82, 114].includes(atomicNumber)) return 14;
  if ([7, 15, 33, 51, 83, 115].includes(atomicNumber)) return 15;
  if ([8, 16, 34, 52, 84, 116].includes(atomicNumber)) return 16;
  if ([9, 17, 35, 53, 85, 117].includes(atomicNumber)) return 17;
  if ([10, 18, 36, 54, 86, 118].includes(atomicNumber)) return 18;
  if (atomicNumber >= 21 && atomicNumber <= 30) return atomicNumber - 18;
  if (atomicNumber >= 39 && atomicNumber <= 48) return atomicNumber - 36;
  if (atomicNumber >= 72 && atomicNumber <= 80) return atomicNumber - 68;
  if (atomicNumber >= 104 && atomicNumber <= 112) return atomicNumber - 100;
  if (atomicNumber >= 57 && atomicNumber <= 71) return atomicNumber - 54;
  if (atomicNumber >= 89 && atomicNumber <= 103) return atomicNumber - 86;
  return -1;
}
