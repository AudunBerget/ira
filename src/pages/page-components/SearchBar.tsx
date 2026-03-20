import { useRef } from "react";
import {MagnifyingGlassIcon, XMarkIcon} from "@navikt/aksel-icons";

export type SearchBarProps = {
  value: string;
  onChange: (newValue: string) => void;
  clear: (newValue: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
  wrapperClassName?: string;
}

export default function SearchBar({
  value,
  onChange,
  clear,
  placeholder = "Søk...",
  label,
  className,
  wrapperClassName,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    clear('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  const handleChange = (newValue: string) => {
    onChange(newValue);
  }

  return (
    <div className={wrapperClassName}>
      <label>{label}</label>
      <div className={'input-search-field'}>
        <MagnifyingGlassIcon className="search-bar-search-icon" />
        <input
          type='search'
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className={className}
        />

        {value.length > 0 && (
          <button
            type="button"
            aria-label="Nullstill søk"
            onClick={handleClear}
            className="search-bar-clear-button">
            {<XMarkIcon />}
          </button>
        )}
      </div>
    </div>
  )
}
