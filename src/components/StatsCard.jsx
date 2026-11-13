import { Activity, CheckCircle2, Users, Wallet } from 'lucide-react';
import { formatPHP } from '../lib/utils';
import { Card } from './ui';

function StatsItem({
  label,
  value,
  valueClassName = '',
  valueSuffix,
  caption,
  icon: Icon,
  iconClassName
}) {
  const valueEl = (
    <p
      className={`${valueSuffix ? '' : 'mt-1 '}text-2xl font-bold tracking-tight ${valueClassName}`}
    >
      {value}
    </p>
  );

  return (
    <Card className="p-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        {valueSuffix ? (
          <div className="mt-1 flex items-baseline gap-2">
            {valueEl}
            <span className="text-xs text-zinc-400">{valueSuffix}</span>
          </div>
        ) : (
          valueEl
        )}
        <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">{caption}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}

export default function StatsCard({ metrics }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsItem
        label="Total Patients"
        value={metrics.totalPatients}
        caption={`Across ${metrics.wardCount} hospital wards`}
        icon={Users}
        iconClassName="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
      />
      <StatsItem
        label="Active Inpatients"
        value={metrics.activeCount}
        valueClassName="text-emerald-600 dark:text-emerald-400"
        valueSuffix={`/ ${metrics.dischargedCount} discharged`}
        caption="Currently occupying beds"
        icon={Activity}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
      />
      <StatsItem
        label="Outstanding Balance"
        value={formatPHP(metrics.outstandingTotal)}
        valueClassName="font-mono text-amber-600 dark:text-amber-400"
        caption={`${metrics.pendingAccounts} accounts pending settlement`}
        icon={Wallet}
        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
      />
      <StatsItem
        label="Cleared Accounts"
        value={metrics.clearedAccounts}
        valueClassName="text-indigo-600 dark:text-indigo-400"
        caption="PHP 0.00 remaining balance"
        icon={CheckCircle2}
        iconClassName="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
      />
    </section>
  );
}
