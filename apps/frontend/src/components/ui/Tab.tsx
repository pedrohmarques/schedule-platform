"use client";

import { Children, isValidElement, ReactElement, ReactNode, createContext, useContext, useState } from "react";

interface TabProps {
  label: string;
  children: ReactNode;
}

interface TabsContextValue {
  activeLabel: string;
  setActiveLabel: (label: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tab({ children }: TabProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tab deve ser usado dentro de Tabs");
  }

  return <>{children}</>;
}

// Tokens de estado do botão de aba — mesma ideia do `themeClasses`/`themedText`
// de MyButton, só que aqui é um único estado (ativo/inativo) em cima das
// mesmas CSS variables do design system (ver globals.scss).
const tabStateClasses: Record<"active" | "inactive", string> = {
  active: "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]",
  inactive:
    "border-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
};

interface TabsProps {
  children: ReactElement<TabProps>[] | ReactElement<TabProps>;
  defaultLabel?: string;
  className?: string;
}

export default function Tabs({ children, defaultLabel, className }: TabsProps) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];
  const [activeLabel, setActiveLabel] = useState(defaultLabel ?? tabs[0]?.props.label);
  const activeTab = tabs.find((tab) => tab.props.label === activeLabel) ?? tabs[0];

  return (
    <TabsContext.Provider value={{ activeLabel, setActiveLabel }}>
      <div className={`w-full ${className ?? ""}`}>
        <div role="tablist" className="flex gap-4 border-b border-[var(--border)]">
          {tabs.map(({ props: { label } }) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={activeLabel === label}
              onClick={() => setActiveLabel(label)}
              className={`-mb-px cursor-pointer rounded-t-[var(--radius)] border-b-2 px-3 pb-2 pt-1.5 text-sm font-medium transition-colors ${
                tabStateClasses[activeLabel === label ? "active" : "inactive"]
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mt-4">
          {activeTab}
        </div>
      </div>
    </TabsContext.Provider>
  );
}
