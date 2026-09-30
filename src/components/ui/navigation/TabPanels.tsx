import { ReactNode } from 'react';

interface TabPanelsProps {
  activeTab: string;
  panels: Record<string, ReactNode>;
}

export function TabPanels({ activeTab, panels }: TabPanelsProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {Object.entries(panels).map(([tabId, panel]) => {
        const isActive = tabId === activeTab;

        return (
          <div
            key={tabId}
            role="tabpanel"
            aria-hidden={!isActive}
            className={
              isActive
                ? 'flex min-h-0 flex-1 flex-col'
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
