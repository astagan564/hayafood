/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from 'react';

export function navigate(path: string) {
  window.history.pushState(null, '', path);
  // Dispatch popstate so useRouter picks up the change
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

