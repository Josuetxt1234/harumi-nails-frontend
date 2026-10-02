import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getRegistersHistoryPath } from '../../../lib/get-registers-history-path';
import { useTodayRegisterSummary } from '../../../hooks/useTodayRegisterSummary';
import { DailyRegisterView } from './DailyRegisterView';
import { PosDaySummaryBar } from './PosDaySummaryBar';

export function DailyRegisterContainer() {
  const { t } = useTranslation('pos');
  const { user } = useAuth();
  const { totalPaidToday, commissionToday, refreshSummary } =
    useTodayRegisterSummary();

  const operatorName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : t('operator');

  return (
    <div className="flex flex-1 flex-col gap-4 lg:min-h-0">
      <PosDaySummaryBar
        operatorName={operatorName}
        totalPaidToday={totalPaidToday}
        commissionToday={commissionToday}
        historyPath={getRegistersHistoryPath(user?.roles)}
      />
      <DailyRegisterView onRegistered={refreshSummary} />
    </div>
  );
}
