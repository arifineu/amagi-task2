import { Activity, Moon, Sun, UserPlus } from 'lucide-react';
import { Badge, Button } from './ui';

export default function Header({ isDark, onToggleTheme, onAddPatient }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Patient Search
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] py-0">
                MedCore Ward OS
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Real-time inpatient census, ward allocation & billing directory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button onClick={onAddPatient} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span>Add Patient</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
