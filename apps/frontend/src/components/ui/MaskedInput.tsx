"use client";

import { InputHTMLAttributes, useState } from "react";
import { IMaskInput } from "react-imask";

type MaskedFieldVariant = "phone" | "cep";

interface MaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "min" | "max"> {
  label: string;
  name: string;
  variant: MaskedFieldVariant;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const maskConfig: Record<
  MaskedFieldVariant,
  { mask: unknown; placeholder: string; expectedLengths: number[]; errorMessage: string }
> = {
  phone: {
    mask: [{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }],
    placeholder: "(11) 91234-5678",
    expectedLengths: [10, 11],
    errorMessage: "Telefone incompleto",
  },
  cep: {
    mask: "00000-000",
    placeholder: "00000-000",
    expectedLengths: [8],
    errorMessage: "CEP incompleto",
  },
};

export default function MaskedInput({
  label,
  id,
  name,
  variant,
  className,
  value,
  onChange,
  onBlur,
  ...props
}: MaskedInputProps) {
  const inputId = id ?? name;
  const [touched, setTouched] = useState(false);
  const config = maskConfig[variant];

  const rawValue = typeof value === "string" ? value : "";
  const digitsOnly = rawValue.replace(/\D/g, "");
  const isIncomplete =
    touched && digitsOnly.length > 0 && !config.expectedLengths.includes(digitsOnly.length);

  function handleAccept(newValue: string) {
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
        mask={config.mask as any}
        id={inputId}
        name={name}
        inputMode="numeric"
        placeholder={config.placeholder}
        value={rawValue}
        onAccept={handleAccept}
        onBlur={handleBlur}
        className={`w-full rounded-[var(--radius)] border ${
          isIncomplete ? "border-[var(--destructive)]" : "border-[var(--border)]"
        } bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${
          className ?? ""
        }`}
        {...props}
      />
      {isIncomplete && <span className="text-xs text-[var(--destructive)]">{config.errorMessage}</span>}
    </div>
  );
}
