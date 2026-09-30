import { DailyRegisterView } from '../../components/features/daily-register/DailyRegisterView';
import { DailyRegistersHistoryView } from '../../components/features/daily-register/DailyRegistersHistoryView';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { useModuleTab } from '../../hooks/useModuleTab';

const DAILY_REGISTER_TABS = [
  { id: 'nuevo', label: 'Nuevo registro' },
  { id: 'historial', label: 'Historial' },
] as const;

const DAILY_REGISTER_TAB_IDS = DAILY_REGISTER_TABS.map((tab) => tab.id);

export function AdminDailyRegisterPage() {
  const { activeTab, setActiveTab } = useModuleTab(
    DAILY_REGISTER_TAB_IDS,
    'nuevo',
  );

  return (
    <ModulePage
      title="Registro diario"
      subtitle="Registra trabajos y consulta el historial del salón."
      tabs={[...DAILY_REGISTER_TABS]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabPanels={{
        nuevo: <DailyRegisterView requireMesaSelection />,
        historial: (
          <DailyRegistersHistoryView
            showHeader={false}
            enabled={activeTab === 'historial'}
          />
        ),
      }}
    />
  );
}
