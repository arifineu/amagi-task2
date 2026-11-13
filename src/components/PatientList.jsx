import { memo } from 'react';
import { Building2, ChevronRight, Filter, RotateCcw } from 'lucide-react';
import { getInitials, onEnterOrSpace } from '../lib/utils';
import { BalanceAmount, Button, Card, StatusBadge } from './ui';

// ============================================================================
// Card view item
// ============================================================================
const PatientCard = memo(function PatientCard({ patient, onSelect }) {
  const isActive = patient.status === 'Active';
  const select = () => onSelect(patient);

  return (
    <Card
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={onEnterOrSpace(select)}
      className="group relative cursor-pointer p-5 hover:border-indigo-500/40 dark:hover:border-indigo-400/40 hover:shadow-md hover:bg-zinc-50/40 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
    >
      {/* Top Row: Avatar, Name, ID, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tracking-tight transition-transform duration-200 group-hover:scale-105 ${
              isActive
                ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-500/20'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {getInitials(patient.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {patient.name}
              </h3>
              <span className="font-mono text-[11px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80">
                {patient.id}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {patient.physician} • Admitted {patient.admittedDate}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status} animated />
      </div>

      <div className="my-4 h-px bg-zinc-100 dark:bg-zinc-800/80" />

      {/* Bottom Metrics Row: Ward & Balance */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500">
            Ward Assignment
          </span>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Ward {patient.ward}</span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {patient.room}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500">
              Balance
            </span>
            <BalanceAmount
              amount={patient.balance}
              className="mt-0.5 block font-mono text-sm font-semibold"
            />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100/70 dark:bg-zinc-800/60 text-zinc-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Card>
  );
});

// ============================================================================
// Table view row
// ============================================================================
const PatientRow = memo(function PatientRow({ patient, onSelect }) {
  const isActive = patient.status === 'Active';
  const select = () => onSelect(patient);

  return (
    <tr
      onClick={select}
      tabIndex={0}
      onKeyDown={onEnterOrSpace(select)}
      className="group cursor-pointer border-b border-zinc-200/70 dark:border-zinc-800/70 last:border-0 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/40 transition-colors focus-visible:outline-none focus-visible:bg-indigo-500/5"
    >
      <td className="py-3.5 pl-5 pr-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
              isActive
                ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-500/20'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {getInitials(patient.name)}
          </div>
          <div>
            <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {patient.name}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{patient.physician}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
          {patient.id}
        </span>
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={patient.status} />
      </td>
      <td className="px-3 py-3.5 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="inline-flex items-center gap-1.5 font-medium">
          Ward {patient.ward}
          <span className="text-xs font-mono text-zinc-400">({patient.room})</span>
        </span>
      </td>
      <td className="px-3 py-3.5 text-right font-mono text-sm font-semibold">
        <BalanceAmount amount={patient.balance} />
      </td>
      <td className="py-3.5 pl-3 pr-5 text-right">
        <ChevronRight className="inline-block h-4 w-4 text-zinc-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
      </td>
    </tr>
  );
});

// ============================================================================
// List: empty state | table | cards (list or grid)
// ============================================================================
export default function PatientList({ patients, viewMode, onSelect, onResetFilters }) {
  if (patients.length === 0) {
    return (
      <Card className="py-16 px-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
          <Filter className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          No matching patients found
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          No records matched your current search or filter criteria. Try clearing filters or
          searching by patient ID.
        </p>
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            <RotateCcw className="h-3.5 w-3.5" />
            Clear all filters
          </Button>
        </div>
      </Card>
    );
  }

  if (viewMode === 'table') {
    return (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/90 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="py-3 pl-5 pr-3">Patient</th>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Ward & Room</th>
                <th className="px-3 py-3 text-right">Balance</th>
                <th className="py-3 pl-3 pr-5 text-right w-10"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} onSelect={onSelect} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
          : 'mx-auto max-w-3xl space-y-3.5'
      }
    >
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} onSelect={onSelect} />
      ))}
    </div>
  );
}
