import { useState, useRef, useEffect } from 'react'

// A dropdown multi-select for filtering by member.
// An empty selection means "show all". The trigger label reflects how many are chosen.
//
// Props:
//   members   – ordered list of member names to show
//   selected  – currently selected names (empty = all)
//   onChange  – called with the updated selection array
interface MultiSelectProps {
  members: string[],
  selected: string[],
  onChange: (selected: string[]) => void
}

export default function MultiSelect({ members, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close the dropdown when the user clicks outside it
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Toggle a single member in/out of the selection
  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name))
    } else {
      onChange([...selected, name])
    }
  }

  // Trigger label: show name if one is selected, count if many, default if none
  const label =
    selected.length === 0 ? 'Alle' :
      selected.length === 1 ? selected[0] :
        `${selected.length} spillere valgt`

  return (
    <div className="member-select" ref={ref}>

      <button
        className={`member-select-trigger ${selected.length > 0 ? 'has-selection' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{label}</span>
        <span className="member-select-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="member-select-dropdown">
          {members.map(name => (
            <label key={name} className="member-select-option">
              <input
                type="checkbox"
                checked={selected.includes(name)}
                onChange={() => toggle(name)}
              />
              <span>{name}</span>
            </label>
          ))}

          {selected.length > 0 && (
            <button className="member-select-clear" onClick={() => onChange([])}>
              Fjern alle
            </button>
          )}
        </div>
      )}

    </div>
  )
}
