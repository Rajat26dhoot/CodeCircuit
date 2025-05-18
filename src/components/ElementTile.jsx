import React from "react"
import { Tooltip } from "react-tooltip"

// RGBA color mapping for each element category
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

export default function ElementTile({ element, onClick, onKeyDown, colorScheme, label }) {
  const showOnlyLabel = Boolean(label)

  const baseColor =
    colorScheme === "default"
      ? categoryColors[element.category] || "rgba(229, 231, 235, 1)"
      : `rgba(${element.atomicNumber % 255}, 100, 200, 1)`

  const borderColor = lightenRgba(baseColor, 90)
  const textColor = lightenRgba(baseColor, 150)

  return (
    <>
        <div
  style={{
    backgroundColor: baseColor,
    border: "2px solid",
    borderColor: borderColor,
    color: textColor,
    fontFamily: '"General Sans", ui-sans-serif, system-ui',
  }}
  className="relative p-1 rounded cursor-pointer hover:shadow-lg transition-shadow duration-300 text-center min-h-[74px] flex flex-col justify-center items-center"
  onClick={() => onClick(element)}
  onKeyDown={onKeyDown}
  role="button"
  tabIndex={0}
  aria-label={`${element.name}, atomic number ${element.atomicNumber}`}
  data-tooltip-id={`element-${element.atomicNumber}`}
  data-tooltip-content={`${element.name} (${element.symbol})`}
>
  {label ? (
    <div className="text-xl font-bold">{label}</div>
  ) : (
    <>
      <div className="absolute top-1 right-1 text-[12px] font-semibold">
        {element.atomicNumber}
      </div>
      <div className="text-2xl pt-3 font-bold">{element.symbol}</div>
      <div className="text-xs pt-1 truncate">{element.name}</div>
    </>
  )}
</div>


      <Tooltip id={`element-${element.atomicNumber}`} />
    </>
  )
}
