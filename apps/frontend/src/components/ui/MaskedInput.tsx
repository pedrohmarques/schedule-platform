"use client";

import { InputHTMLAttributes, useState } from "react";
import { IMaskInput } from "react-imask";
import Tooltip from "./Tooltip";
import { Info } from "lucide-react";

type MaskedFieldVariant = "phone" | "cep" | "price";

interface MaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "min" | "max"> {
  label: string;
  name: string;
  tooltip?: string;
  variant: MaskedFieldVariant;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// IMaskInput's `mask` prop (and related options like `scale`/`radix`) is a
// big overloaded union in its own type definitions (string pattern vs. date
// vs. number vs. dynamic array...). Passing a variable typed as that union
// confuses TS overload resolution, even though `imask` itself handles all
// these shapes fine at runtime — so we type it loosely here on purpose.
const maskConfig: Record<
  MaskedFieldVariant,
  {
    mask: unknown;
    // opções extras específicas do IMask para esse variant (scale, radix, etc.)
    imaskOptions?: Record<string, unknown>;
    placeholder: string;
    // sem expectedLengths -> variant não tem noção de "incompleto" (ex.: price,
    // onde "5" e "5,00" são igualmente válidos, não existe um tamanho fixo certo)
    expectedLengths?: number[];
    errorMessage?: string;
  }
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
  price: {
    mask: Number,
    imaskOptions: {
      scale: 2, // 2 casas decimais
      radix: ",", // separador decimal (padrão BR)
      mapToRadix: ["."], // deixa digitar "." também, mas converte pra ","
      thousandsSeparator: ".",
      padFractionalZeros: true,
      normalizeZeros: true,
      min: 0, // não aceita negativo
    },
    placeholder: "0,00",
  },
};

export default function MaskedInput({
  label,
  id,
  name,
  tooltip,
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
    touched &&
    !!config.expectedLengths &&
    digitsOnly.length > 0 &&
    !config.expectedLengths.includes(digitsOnly.length);

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
      <div className="flex gap-2">
        <label htmlFor={name} className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <button type="button" className="cursor-help text-[var(--muted-foreground)]">
              <Info size={16} />
            </button>
          </Tooltip>
        )}
      </div>
      <IMaskInput
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mask={config.mask as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(config.imaskOptions as any)}
        id={inputId}
        name={name}
        inputMode={variant === "price" ? "decimal" : "numeric"}
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
