import React, { ReactNode } from "react";

export interface TabProps {
  label: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Tab({ label, disabled, className, children }: TabProps) {
  return <div
    className={className}
    role="tabpanel"
  >
    {children}
  </div>
}
