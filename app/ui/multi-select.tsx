"use client";

import { useEffect, useRef, useState } from "react";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  name: string;
  placeholder?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  name,
  placeholder = "Select options...",
  gradientFrom = "blue-500",
  gradientTo = "purple-500",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full rounded-xl border-0 py-2 px-3 text-gray-900 shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-inset ring-gray-300/50 hover:ring-2 hover:ring-blue-500/30 sm:text-sm sm:leading-6 transition-all duration-300"
      >
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {value.map((id) => {
              const option = options.find((opt) => opt.id === id);
              return (
                <span
                  key={id}
                  className={`inline-flex items-center px-2 py-1 rounded-lg text-xs text-gray-700 ${
                    gradientFrom === "blue-500" && gradientTo === "purple-500"
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                      : gradientFrom === "purple-500" &&
                        gradientTo === "pink-500"
                      ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                      : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  }`}
                >
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(value.filter((v) => v !== id));
                    }}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-xl bg-white/90 backdrop-blur-xl shadow-lg border border-gray-200/50 py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 cursor-pointer hover:bg-blue-50/50 flex items-center gap-2"
              onClick={() => {
                onChange(
                  value.includes(option.id)
                    ? value.filter((id) => id !== option.id)
                    : [...value, option.id]
                );
              }}
            >
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                onChange={() => {}}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                title={`Select ${option.label}`}
                aria-label={`Select ${option.label}`}
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
      <input type="hidden" name={name} value={value.join(",")} />
    </div>
  );
}
