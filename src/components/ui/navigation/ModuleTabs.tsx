export interface ModuleTab {
  id: string;
  label: string;
}

interface ModuleTabsProps {
  tabs: ModuleTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ModuleTabs({ tabs, activeTab, onTabChange }: ModuleTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Secciones del módulo"
      className="mb-6 flex w-fit shrink-0 gap-2 rounded-2xl border border-slate-border bg-white p-1.5 shadow-sm"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={[
              'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
              isActive
                ? 'bg-brand text-white shadow-sm'
                : 'text-slate-body hover:bg-slate-50 hover:text-slate-heading',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
