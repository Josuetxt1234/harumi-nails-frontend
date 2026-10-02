import { ReactNode } from 'react';

interface TabPanelsProps {
  activeTab: string;
  panels: Record<string, ReactNode>;
}

export function TabPanels({ activeTab, panels }: TabPanelsProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto lg:min-h-0 lg:overflow-hidden">
      {Object.entries(panels).map(([tabId, panel]) => {
        const isActive = tabId === activeTab;

        return (
          <div
            key={tabId}
            role="tabpanel"
            aria-hidden={!isActive}
            className={
              isActive
                ? 'flex flex-1 flex-col lg:min-h-0'
                : 'hidden'
            }
          >
            {panel}
          </div>
        );
      })}
    </div>
  );
}
