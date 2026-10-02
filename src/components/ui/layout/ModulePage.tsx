import { ReactNode } from 'react';
import { ModuleTab, ModuleTabs } from '../navigation/ModuleTabs';
import { TabPanels } from '../navigation/TabPanels';
import { PageHeader } from './PageHeader';

interface ModulePageProps {
  title: string;
  subtitle: string;
  tabs?: ModuleTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabPanels?: Record<string, ReactNode>;
  children?: ReactNode;
}

export function ModulePage({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  tabPanels,
  children,
}: ModulePageProps) {
  return (
    <div className="flex flex-1 flex-col lg:min-h-0">
      <PageHeader title={title} subtitle={subtitle} />

      {tabs && activeTab && onTabChange ? (
        <ModuleTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      ) : null}

      {tabPanels && activeTab ? (
        <TabPanels activeTab={activeTab} panels={tabPanels} />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto lg:min-h-0 lg:overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
