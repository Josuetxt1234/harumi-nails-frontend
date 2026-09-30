import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
  );
}
