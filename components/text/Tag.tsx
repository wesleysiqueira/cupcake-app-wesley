import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export function Tag({ children, variant = "default", className = "" }: TagProps) {
  const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";
  const variantStyles = {
    default: "bg-white text-orange-500",
    outline: "border border-white text-white",
  };

  return <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</span>;
}
