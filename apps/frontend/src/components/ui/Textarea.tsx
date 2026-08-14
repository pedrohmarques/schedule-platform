"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function Textarea({ label, id, name, className, rows = 4, ...props }: TextareaProps) {
  const textareaId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={textareaId} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        className={`w-full resize-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
