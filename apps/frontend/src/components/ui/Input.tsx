"use client";

import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

type InputType = "text" | "email" | "password" | "number";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  type?: InputType;
}

export default function Input({ label, type = "text", id, name, className, ...props }: InputProps) {
  const inputId = id ?? name;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={inputId}
          name={name}
          type={inputType}
          className={`w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${isPassword ? "pr-10" : ""} ${className ?? ""}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-3 flex items-center text-[var(--muted-foreground)]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        )}
      </div>
      
    </div>
  );
}
