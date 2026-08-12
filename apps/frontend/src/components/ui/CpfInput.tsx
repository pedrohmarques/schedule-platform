"use client";

import { InputHTMLAttributes } from "react";
import { IMaskInput } from "react-imask";
import { XCircle } from "lucide-react";
import { useValidation } from "@/hooks/useValidation";
import { combine, isCpf, required } from "@/lib/validators";

interface CpfInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  forceShow?: boolean;
}

const validateCpf = combine(required(), isCpf());

export default function CpfInput({
  label,
  id,
  name,
  className,
  value,
  onChange,
  onBlur,
  forceShow = false,
  ...props
}: CpfInputProps) {
  const inputId = id ?? name;
  const rawValue = typeof value === "string" ? value : "";
  const { error, isInvalid, handleBlur: markTouched } = useValidation(rawValue, validateCpf, forceShow);

  function handleAccept(newValue: string) {
    // IMask reports changes via onAccept(value), not a native ChangeEvent,
    // so we build a minimal fake one to keep working with the parent's
    // shared handleChange (which reads e.target.name / e.target.value).
    const fakeEvent = {
      target: { name, value: newValue },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(fakeEvent);
  }

  function handleInputBlur(e: React.FocusEvent<HTMLInputElement>) {
    markTouched();
    onBlur?.(e);
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div className="relative">
        {isInvalid && (
          <XCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--destructive)]" />
        )}
        <IMaskInput
          mask="000.000.000-00"
          id={inputId}
          name={name}
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={rawValue}
          onAccept={handleAccept}
          onBlur={handleInputBlur}
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
