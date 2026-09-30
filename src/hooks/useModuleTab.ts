import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useModuleTab(
  validTabs: readonly string[],
  defaultTab: string,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabsKey = validTabs.join('|');

  const activeTab = useMemo(() => {
    const requestedTab = searchParams.get('tab') ?? defaultTab;
    return validTabs.includes(requestedTab) ? requestedTab : defaultTab;
  }, [defaultTab, searchParams, validTabs, validTabsKey]);

  const setActiveTab = useCallback(
    (nextTab: string) => {
      if (!validTabs.includes(nextTab)) {
        return;
      }

      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);

          if (nextTab === defaultTab) {
            nextParams.delete('tab');
          } else {
            nextParams.set('tab', nextTab);
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [defaultTab, setSearchParams, validTabsKey, validTabs],
  );

  return { activeTab, setActiveTab };
}
