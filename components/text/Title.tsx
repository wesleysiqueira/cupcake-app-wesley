import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3";
  className?: string;
  withDecoration?: boolean;
}

export function Title({
  children,
  variant = "h1",
  className = "",
  withDecoration = false,
}: TitleProps) {
  const baseStyles = "font-bold text-gray-900 font-montserrat";
  const variantStyles = {
    h1: "text-3xl mb-4",
    h2: "text-2xl mb-3",
    h3: "text-xl mb-2",
  };

  const decorationStyles = withDecoration
    ? 'relative after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:w-[100%] after:h-[2px] after:bg-orange-500 after:rounded-full'
    : "";

  const Tag = variant;
  return (
    <Tag className={`${baseStyles} ${variantStyles[variant]} ${decorationStyles} ${className}`}>
      {children}
    </Tag>
  );
}
