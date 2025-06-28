import React, { ReactElement, useState } from "react";
import Tab, { TabProps } from "./Tab";

interface TabsProps {
  activeTabIndex?: number;
  className?: string;
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

export default function Tabs({ activeTabIndex = 0, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(activeTabIndex)

  const tabs = React.Children.toArray(children)
    .filter((child) =>
      React.isValidElement(child) && child.type === Tab
    )

  return (
    <div className={className}>
      <nav>
        <ul className="flex row list-none p-0">
          {tabs.map((tab: ReactElement<TabProps>, index) =>
            <li className="shadow-card w-full">
              <button className="w-full border-none bg-transparent p-2" onClick={() => setActiveTab(index)}>
                {tab.props.label}
              </button>
            </li>
          )}
        </ul>
      </nav>
      {tabs[activeTab]}
    </div>
  )
}
