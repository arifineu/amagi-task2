import { CheckCircle2 } from 'lucide-react';
import { formatPHP } from '../lib/utils';

// ============================================================================
// shadcn/ui-inspired primitives + small shared bits
// ============================================================================

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 text-zinc-950 dark:text-zinc-50 shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

const badgeVariants = {
  default: 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900',
  secondary:
    'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60',
  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
  discharged: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  settled: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20'
};

export function Badge({ variant = 'default', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${badgeVariants[variant] || badgeVariants.default} ${className}`}
    >
      {children}
    </span>
  );
}

const buttonVariants = {
  default:
    'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm',
  outline:
    'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200',
  ghost:
    'hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
  subtle:
    'bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800'
};

const buttonSizes = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 rounded-lg px-3 text-xs',
  icon: 'h-9 w-9 p-0'
};

export function Button({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Active / Discharged badge. `animated` adds the pulsing dot used on cards. */
export function StatusBadge({ status, animated = false }) {
  const isActive = status === 'Active';
  const dotClass = isActive
    ? `bg-emerald-500${animated ? ' animate-pulse' : ''}`
    : `bg-zinc-400${animated ? ' dark:bg-zinc-500' : ''}`;

  return (
    <Badge variant={isActive ? 'active' : 'discharged'}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {status}
    </Badge>
  );
}

/** PHP amount — amber when outstanding, emerald when settled. */
export function BalanceAmount({ amount, className = '' }) {
  const color =
    amount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
  return <span className={`${className} ${color}`.trim()}>{formatPHP(amount)}</span>;
}

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-xs font-medium text-zinc-50 dark:text-zinc-900 shadow-lg">
      <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
