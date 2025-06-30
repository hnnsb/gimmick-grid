import React, {ReactElement, useState} from "react";
import Tab, {TabProps} from "./Tab";
import "./tabs.css";
import {clsx} from "clsx";

interface TabsProps {
  activeTabIndex?: number;
  className?: string;
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

export default function Tabs({activeTabIndex = 0, className, children}: Readonly<TabsProps>) {
  const [activeTab, setActiveTab] = useState(activeTabIndex)

  const tabs = React.Children.toArray(children)
    .filter((child) =>
      React.isValidElement(child) && child.type === Tab
    )

  const isSelected = (i: number) => activeTab === i;

  return (
    <div className={className}>
      <nav>
        <ul className="tab-container">
          {tabs.map((tab: ReactElement<TabProps>, index) =>
            <li key={tab.props.label + index}
                className={clsx('tab', {
                  disabled: tab.props.disabled,
                  selected: isSelected(index),
                })}
            >
              <button
                className="w-full border-none bg-transparent p-2"
                onClick={() => setActiveTab(index)}
                disabled={tab.props.disabled}
              >
              <span
                className={clsx('text-lg', {
                  'font-bold': isSelected(index),
                  disabled: tab.props.disabled,
                })}
              >
                {tab.props.label}
              </span>
              </button>
            </li>
          )}
        </ul>
      </nav>
      {tabs[activeTab]}
    </div>
  )
}
