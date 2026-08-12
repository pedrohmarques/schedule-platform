"use client";

import { InputHTMLAttributes, useState } from "react";
import { IMaskInput } from "react-imask";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

interface CpfInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CpfInput({
  label,
  id,
  name,
  className,
  value,
  onChange,
  onBlur,
  ...props
}: CpfInputProps) {
  const inputId = id ?? name;
  const [touched, setTouched] = useState(false);

  const rawValue = typeof value === "string" ? value : "";
  const digitsOnly = rawValue.replace(/\D/g, "");
  const isInvalid = touched && digitsOnly.length === 11 && !cpfValidator.isValid(digitsOnly);

  function handleAccept(newValue: string) {
    // IMask reports changes via onAccept(value), not a native ChangeEvent,
    // so we build a minimal fake one to keep working with the parent's
    // shared handleChange (which reads e.target.name / e.target.value).
    const fakeEvent = {
      target: { name, value: newValue },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(fakeEvent);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched(true);
    onBlur?.(e);
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <IMaskInput
        mask="000.000.000-00"
        id={inputId}
        name={name}
        inputMode="numeric"
        placeholder="000.000.000-00"
        value={rawValue}
        onAccept={handleAccept}
        onBlur={handleBlur}
        className={`w-full rounded-[var(--radius)] border ${
          isInvalid ? "border-[var(--destructive)]" : "border-[var(--border)]"
        } bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${
          className ?? ""
        }`}
        {...props}
      />
      {isInvalid && <span className="text-xs text-[var(--destructive)]">CPF inválido</span>}
    </div>
  );
}
