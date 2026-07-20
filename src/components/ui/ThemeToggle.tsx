import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';


export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 gold-border-glow ${
        isDark
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          : 'bg-amber-500/10 border-amber-500/40 text-amber-700 hover:bg-amber-500/20'
      } ${className}`}
      aria-label={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      title={isDark ? 'Mode Gelap (Klik untuk Mode Terang)' : 'Mode Terang (Klik untuk Mode Gelap)'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 stroke-[2.2] text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 stroke-[2.2] text-amber-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
