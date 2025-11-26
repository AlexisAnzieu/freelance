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
}

export default function MultiSelect({
  options,
  value,
  onChange,
  name,
  placeholder = "Select options...",
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
        className="cursor-pointer w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] hover:bg-[#f7f6f3] transition-colors"
      >
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {value.map((id) => {
              const option = options.find((opt) => opt.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-[#e8f4fd] text-[#2383e2] text-xs"
                >
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(value.filter((v) => v !== id));
                    }}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-[#9b9a97]">{placeholder}</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white border border-[#e8e8e8] py-1 max-h-60 overflow-auto shadow-sm">
          {options.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 cursor-pointer hover:bg-[#f7f6f3] flex items-center gap-2 text-sm text-[#37352f]"
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
                className="h-4 w-4 rounded border-[#e8e8e8] text-[#2383e2] focus:ring-[#2383e2]"
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
