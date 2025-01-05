'use client'

interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

export function Slider({ min, max, step, value, onChange }: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  )
} 