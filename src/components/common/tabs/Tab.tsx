import React, { ReactNode } from "react";

export interface TabProps {
  label: string;
  className?: string;
  children: ReactNode;
}

export default function Tab({ label, className, children }: TabProps) {
  return <div
    className={className}
    role="tabpanel"
  >
    {children}
  </div>
}
