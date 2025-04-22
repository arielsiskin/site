import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "uppercase font-normal rounded-[5px] transition-all duration-200 ease-in-out";

  const variantStyles = {
    primary:
      "bg-[#04CCDB] text-white font-bold hover:bg-[#03b8c6] active:bg-[#039da9]",
    secondary:
      "bg-[#333333] text-white font-bold hover:bg-[#444444] active:bg-[#222222]",
    outline:
      "bg-transparent border-2 border-[#04CCDB] text-[#04CCDB] hover:bg-[#04CCDB10] active:bg-[#04CCDB20]",
  };

  const sizeStyles = {
    sm: "text-xs h-[32px] px-3 md:px-4",
    md: "text-sm h-[38px] px-4 md:px-6",
    lg: "text-base h-[44px] px-5 md:px-8",
  };

  const widthStyles = fullWidth
    ? "w-full"
    : "w-[140px] md:w-[150px] lg:w-[170px]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
