import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  variant?: "default" | "small" | "large";
  className?: string;
}

export function Text({ children, variant = "default", className = "" }: TextProps) {
  const baseStyles = "text-gray-600";
  const variantStyles = {
    default: "text-base mb-4",
    small: "text-sm mb-3",
    large: "text-lg mb-5",
  };

  return <p className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</p>;
}
