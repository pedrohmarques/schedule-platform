"use client";

import { Professional } from "@/types/Professional";
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function Select({ label, name, value, onChange, options, placeholder = "Selecione..." }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={name} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>

      <RadixSelect.Root value={value} onValueChange={onChange} name={name}>
        <RadixSelect.Trigger
          id={name}
          className="flex w-full items-center justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] data-[placeholder]:text-[var(--muted-foreground)]"
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className="z-[60] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-md">
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer items-center rounded-[calc(var(--radius)-4px)] px-8 py-2 text-sm outline-none data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-[var(--accent-foreground)]"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}