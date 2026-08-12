"use client";

import { InputHTMLAttributes } from "react";
import { XCircle } from "lucide-react";
import { useValidation, Validator } from "@/hooks/useValidation";

type InputType = "text" | "email" | "password" | "number";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  type?: InputType;
  validate?: Validator;
  forceShow?: boolean;
}

export default function Input({
  label,
  type = "text",
  id,
  name,
  className,
  validate,
  forceShow = false,
  value,
  onBlur,
  ...props
}: InputProps) {
  const inputId = id ?? name;
  const rawValue = typeof value === "string" ? value : "";
  const { error, isInvalid, handleBlur } = useValidation(rawValue, validate, forceShow);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div className="relative">
        {isInvalid && (
          <XCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--destructive)]" />
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onBlur={(e) => {
            handleBlur();
            onBlur?.(e);
          }}
          className={`w-full rounded-[var(--radius)] border ${
            isInvalid ? "border-[var(--destructive)]" : "border-[var(--border)]"
          } bg-[var(--background)] py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${
            isInvalid ? "pl-9 pr-4" : "px-4"
          } ${className ?? ""}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-[var(--destructive)]">{error}</span>}
    </div>
  );
}
