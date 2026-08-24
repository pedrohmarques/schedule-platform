"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Side = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: Side;
  sideOffset?: number;
  className?: string;
}

export default function Tooltip({ content, children, side = "top", sideOffset = 6, className = "" }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>

      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={sideOffset}
          className={`z-[70] max-w-xs text-balance rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] px-3 py-1.5 text-xs text-[var(--popover-foreground)] shadow-md ${className}`}
        >
          {content}
          <RadixTooltip.Arrow className="fill-[var(--popover)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
