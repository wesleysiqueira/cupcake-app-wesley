"use client";

import { forwardRef } from "react";

import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  format?: (value: string) => string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, name, type = "text", error, className, format, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (format) {
        e.target.value = format(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            "block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all",
            "placeholder:text-gray-400",
            "focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          id={id}
          name={name}
          type={type}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
