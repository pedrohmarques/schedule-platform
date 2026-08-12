"use client";

import { InputHTMLAttributes } from "react";

type InputType = "text" | "email" | "password" | "number";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  type?: InputType;
}

export default function Input({ label, type = "text", id, name, className, ...props }: InputProps) {
  const inputId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        className={`w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
