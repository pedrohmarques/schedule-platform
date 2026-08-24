"use client";

import { useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as RadixSelect from "@radix-ui/react-select";
import { DayPicker, type DropdownProps } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { format, isValid, parse } from "date-fns";
import { CalendarDays, Check, ChevronDown, Info } from "lucide-react";
import { IMaskInput } from "react-imask";
import Tooltip from "./Tooltip";

const DISPLAY_FORMAT = "dd/MM/yyyy";
const ISO_FORMAT = "yyyy-MM-dd";

/**
 * Calendário estilizado com os tokens do design system, sem a folha de estilo
 * padrão do react-day-picker. As chaves vêm do enum UI da lib; os estados de
 * dia (selected/today/disabled) chegam na célula, por isso alcançamos o botão
 * interno com o seletor de filho.
 */
const calendarClassNames = {
  root: "text-sm text-[var(--popover-foreground)]",
  months: "flex flex-col gap-3",
  month: "flex flex-col gap-3",
  month_caption: "flex items-center justify-center",
  caption_label: "text-sm font-medium capitalize",
  nav: "flex items-center justify-between absolute inset-x-0 top-3.5 px-1",
  button_previous:
    "inline-flex size-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  button_next:
    "inline-flex size-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  chevron: "size-4 fill-current",
  dropdowns: "flex items-center justify-center gap-2",
  dropdown_root: "relative",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "flex size-9 items-center justify-center text-xs font-medium capitalize text-[var(--muted-foreground)]",
  weeks: "",
  week: "flex w-full",
  day: "size-9 p-0 text-center",
  day_button:
    "inline-flex size-9 items-center justify-center rounded-md transition-colors cursor-pointer hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]",
  selected:
    "[&>button]:bg-[var(--primary)] [&>button]:text-[var(--primary-foreground)] [&>button]:font-medium [&>button:hover]:bg-[var(--primary)] [&>button:hover]:text-[var(--primary-foreground)]",
  today: "[&>button]:font-semibold [&>button]:text-[var(--primary)]",
  outside: "[&>button]:text-[var(--muted-foreground)] [&>button]:opacity-50",
  disabled:
    "[&>button]:pointer-events-none [&>button]:opacity-35 [&>button]:cursor-not-allowed",
  hidden: "invisible",
};

// Nas classes de borda abaixo, o prefixo `color:` no valor arbitrário deixa
// explícito que o valor é cor, e não largura — o Tailwind infere sozinho,
// mas a forma explícita não depende dessa inferência.
//
// Para o estado de erro aparecer, a regra `*` do globals.scss precisa estar
// dentro de @layer base: CSS sem layer vence CSS em layer, e sem isso ela
// sobrescrevia qualquer utility de border-color.

/** "1994-03-27" -> "27/03/1994". String vazia ou inválida vira "". */
function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const date = parse(iso, ISO_FORMAT, new Date());
  return isValid(date) ? format(date, DISPLAY_FORMAT) : "";
}

/**
 * "27/03/1994" -> Date. Devolve null se estiver incompleta ou se for uma data
 * que não existe: o date-fns aceita "31/02/2026" e rola pra 03/03, então
 * comparamos a volta da formatação pra rejeitar esse caso.
 */
function displayToDate(display: string): Date | null {
  if (display.replace(/\D/g, "").length !== 8) return null;

  const date = parse(display, DISPLAY_FORMAT, new Date());
  if (!isValid(date) || format(date, DISPLAY_FORMAT) !== display) return null;

  return date;
}

/**
 * Substitui o `<select>` nativo que a lib usa na navegação de mês/ano. O
 * popup do select nativo é desenhado pelo sistema operacional e não aceita
 * CSS, então trocamos pelo Radix Select — o mesmo do componente Select.
 */
function CalendarDropdown({ options = [], value, onChange, "aria-label": ariaLabel }: DropdownProps) {
  function handleValueChange(next: string) {
    // A lib lê `event.target.value`; montamos o mínimo que ela consome,
    // mesma abordagem do evento sintético do MaskedInput.
    onChange?.({
      target: { value: next },
    } as React.ChangeEvent<HTMLSelectElement>);
  }

  return (
    <RadixSelect.Root value={String(value)} onValueChange={handleValueChange}>
      <RadixSelect.Trigger
        aria-label={ariaLabel}
        className="flex items-center gap-1 rounded-md border border-[color:var(--border)] bg-[var(--background)] px-2 py-1 text-sm font-medium capitalize outline-none transition-colors cursor-pointer hover:bg-[var(--muted)] focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDown className="size-3.5 text-[var(--muted-foreground)]" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-[70] overflow-hidden rounded-[var(--radius)] border border-[color:var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-md"
        >
          <RadixSelect.ScrollUpButton className="flex h-6 items-center justify-center bg-[var(--popover)] text-[var(--muted-foreground)]">
            <ChevronDown className="size-3.5 rotate-180" />
          </RadixSelect.ScrollUpButton>

          <RadixSelect.Viewport className="max-h-60 p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={String(option.value)}
                disabled={option.disabled}
                className="relative flex cursor-pointer items-center rounded-[calc(var(--radius)-4px)] px-8 py-2 text-sm capitalize outline-none data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-[var(--accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
              >
                <RadixSelect.ItemIndicator className="absolute left-2">
                  <Check className="size-4" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>

          <RadixSelect.ScrollDownButton className="flex h-6 items-center justify-center bg-[var(--popover)] text-[var(--muted-foreground)]">
            <ChevronDown className="size-3.5" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

interface DateInputProps {
  label: string;
  name: string;
  /** Data no formato ISO `yyyy-MM-dd`, ou "" quando vazia. */
  value: string;
  /** Recebe ISO `yyyy-MM-dd`, ou "" quando o campo é limpo. */
  onChange: (isoDate: string) => void;
  tooltip?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Limites de seleção, também em ISO `yyyy-MM-dd`. */
  min?: string;
  max?: string;
  className?: string;
}

/**
 * Campo de data com calendário. Digita-se dd/MM/yyyy ou escolhe-se no
 * calendário; para fora, o valor sempre trafega em ISO `yyyy-MM-dd`, que é o
 * formato que a API espera (`new Date("27/03/1994")` seria Invalid Date).
 */
export default function DateInput({
  label,
  name,
  value,
  onChange,
  tooltip,
  placeholder = "dd/mm/aaaa",
  disabled = false,
  min,
  max,
  className,
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Estado derivado de `value` sem useEffect: o ajuste acontece durante a
  // renderização, que é o padrão recomendado pelo React pra sincronizar
  // estado com prop (e não dispara cascata de re-render).
  const [text, setText] = useState(() => isoToDisplay(value));
  const [lastValue, setLastValue] = useState(value);

  if (value !== lastValue) {
    setLastValue(value);
    setText(isoToDisplay(value));
  }

  const selected = displayToDate(text) ?? undefined;
  const digits = text.replace(/\D/g, "");
  const isInvalid = touched && digits.length > 0 && !selected;

  const minDate = min ? (displayToDate(isoToDisplay(min)) ?? undefined) : undefined;
  const maxDate = max ? (displayToDate(isoToDisplay(max)) ?? undefined) : undefined;

  function commit(next: string) {
    setText(next);

    if (!next) {
      setLastValue("");
      onChange("");
      return;
    }

    const date = displayToDate(next);
    if (date) {
      const iso = format(date, ISO_FORMAT);
      setLastValue(iso);
      onChange(iso);
    }
  }

  function handleDaySelect(date: Date | undefined) {
    if (!date) return;

    const display = format(date, DISPLAY_FORMAT);
    setText(display);
    setLastValue(format(date, ISO_FORMAT));
    onChange(format(date, ISO_FORMAT));
    setTouched(true);
    setOpen(false);
  }

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className ?? ""}`}>
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

      <Popover.Root open={open} onOpenChange={setOpen}>
        <div className="relative w-full">
          <IMaskInput
            mask="00/00/0000"
            id={name}
            name={name}
            inputRef={inputRef}
            inputMode="numeric"
            placeholder={placeholder}
            disabled={disabled}
            value={text}
            onAccept={commit}
            onBlur={() => setTouched(true)}
            className={`w-full rounded-[var(--radius)] border ${
              isInvalid
                ? "border-[color:var(--destructive)]"
                : "border-[color:var(--border)]"
            } bg-[var(--background)] py-2.5 pl-4 pr-11 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50`}
          />

          <Popover.Trigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Abrir calendário de ${label.toLowerCase()}`}
              className="absolute inset-y-0 right-3 flex items-center text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarDays size={18} />
            </button>
          </Popover.Trigger>
        </div>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="relative z-[60] rounded-[var(--radius)] border border-[color:var(--border)] bg-[var(--popover)] p-3 text-[var(--popover-foreground)] shadow-md"
          >
            <DayPicker
              mode="single"
              locale={ptBR}
              selected={selected}
              onSelect={handleDaySelect}
              defaultMonth={selected}
              startMonth={minDate}
              endMonth={maxDate}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              // dropdown de mês/ano: sem isso, escolher 1994 exige ~380
              // cliques na seta de mês anterior
              captionLayout="dropdown"
              classNames={calendarClassNames}
              components={{ Dropdown: CalendarDropdown }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {isInvalid && (
        <span className="text-xs text-[var(--destructive)]">Data inválida</span>
      )}
    </div>
  );
}
