"use client"

import { type SectionId } from "./VisualEditorShell"

interface Props {
  id: string
  selected: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}

export function SectionWrapper({ id, selected, onClick, label, children }: Props) {
  return (
    <div
      id={`preview-${id}`}
      className={`relative group cursor-pointer transition-all duration-150 ${selected ? "ring-2 ring-violet-500 ring-inset" : "ring-0"}`}
      onClick={e => { e.stopPropagation(); onClick() }}
    >
      {/* Hover overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-150 ${selected ? "bg-violet-500/5" : "bg-transparent group-hover:bg-violet-500/[0.04]"}`} />

      {/* Section label badge */}
      <div className={`absolute top-2 left-2 z-20 transition-all duration-150 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${selected ? "bg-violet-600 text-white" : "bg-white/90 text-violet-600 border border-violet-200"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {label}
        </span>
      </div>

      {/* Edit indicator */}
      {!selected && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs bg-white/90 border border-gray-200 text-gray-600 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm font-medium">
            Click to edit
          </span>
        </div>
      )}

      {children}
    </div>
  )
}
