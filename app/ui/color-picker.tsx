"use client";

import { PROJECT_COLORS } from "@/app/lib/constants";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  name?: string;
}

export default function ColorPicker({
  value,
  onChange,
  name,
}: ColorPickerProps) {
  return (
    <div>
      {name && <input type="hidden" name={name} value={value} />}
      <div className="flex flex-wrap gap-2 items-center">
        {PROJECT_COLORS.map((color) => (
          <button
            key={color.hex}
            type="button"
            onClick={() => onChange(color.hex)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === color.hex
                ? "border-[#37352f] scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
        <label
          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center overflow-hidden ${
            !PROJECT_COLORS.some((c) => c.hex === value)
              ? "border-[#37352f] scale-110"
              : "border-gray-300 hover:scale-105"
          }`}
          style={{
            background: !PROJECT_COLORS.some((c) => c.hex === value)
              ? value
              : "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
          }}
          title="Custom color"
          aria-label="Select custom color"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 absolute w-0 h-0"
          />
        </label>
      </div>
    </div>
  );
}
