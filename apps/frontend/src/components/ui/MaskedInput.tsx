"use client";

import { InputHTMLAttributes } from "react";
import { IMaskInput } from "react-imask";
import { XCircle } from "lucide-react";
import { useValidation } from "@/hooks/useValidation";
import { combine, digitsLength, required } from "@/lib/validators";

type MaskedFieldVariant = "phone" | "cep";

interface MaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "min" | "max"> {
  label: string;
  name: string;
  variant: MaskedFieldVariant;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  forceShow?: boolean;
}

// IMaskInput's `mask` prop is a big overloaded union in its own type
// definitions (string pattern vs. date vs. number vs. dynamic array...).
// Passing a variable typed as that union confuses TS overload resolution,
// even though `imask` itself handles all these shapes fine at runtime —
// so we type it loosely here on purpose.
const maskConfig: Record<
  MaskedFieldVariant,
  { mask: unknown; placeholder: string; expectedLengths: number[]; errorMessage: string }
> = {
  phone: {
    mask: [{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }],
    placeholder: "(11) 91234-5678",
    expectedLengths: [10, 11],
    errorMessage: "Telefone deve ter DDD + número. Ex: (11) 90000-0000",
  },
  cep: {
    mask: "00000-000",
    placeholder: "00000-000",
    expectedLengths: [8],
    errorMessage: "CEP inválido",
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
  forceShow = false,
  ...props
}: MaskedInputProps) {
  const inputId = id ?? name;
  const config = maskConfig[variant];
  const validate = combine(required(), digitsLength(config.expectedLengths, config.errorMessage));

  const rawValue = typeof value === "string" ? value : "";
  const { error, isInvalid, handleBlur: markTouched } = useValidation(rawValue, validate, forceShow);

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mask={config.mask as any}
          id={inputId}
          name={name}
          inputMode="numeric"
          placeholder={config.placeholder}
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
