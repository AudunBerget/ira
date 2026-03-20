import {useState} from "react";

type DatePickerProps = {
  min: string,
  max: string,
  name: string,
  value: string,
  resetValue: string,
  setDate: (date: string) => void
}

export default function DatePicker({ min, max, name, value, resetValue, setDate }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value);

  return (
    <input
      type='date'
      name={name}
      min={min}
      max={max}
      value={selectedDate}
      onChange={(e) => {
        setSelectedDate(e.target.value || resetValue);
        setDate(e.target.value || resetValue);
      }}

    />
  )
}
