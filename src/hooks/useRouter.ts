import { useState, useEffect } from 'react';

export function useRouter() {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onChange = () => {
      setPath(window.location.pathname || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return path;
}
