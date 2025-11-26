"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      className = "",
      disabled,
      loading = false,
      loadingText,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${className}`}
        disabled={isDisabled}
        aria-busy={loading}
        {...rest}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        <span>
          {loading
            ? loadingText || (typeof children === "string" ? children : "")
            : children}
        </span>
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
