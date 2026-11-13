import { ArrowUpDown, LayoutGrid, List, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { Card } from './ui';

const SORT_OPTIONS = [
  { value: 'id-asc', label: 'Sort: Patient ID' },
  { value: 'name-asc', label: 'Sort: Name (A–Z)' },
  { value: 'balance-desc', label: 'Sort: Balance (High–Low)' },
  { value: 'balance-asc', label: 'Sort: Balance (Low–High)' }
];

const VIEW_OPTIONS = [
  { mode: 'list', title: 'Stacked Cards View', Icon: Sparkles },
  { mode: 'grid', title: '2-Column Grid View', Icon: LayoutGrid },
  { mode: 'table', title: 'Compact Table View', Icon: List }
];

const PILL_INACTIVE =
  'bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800';
const PILL_ACTIVE = 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900';

function PillGroup({
  label,
  options,
  value,
  onChange,
  getLabel = (o) => o,
  activeClass = PILL_ACTIVE
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mr-1">{label}:</span>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
            value === option ? activeClass : PILL_INACTIVE
          }`}
        >
          {getLabel(option)}
        </button>
      ))}
    </div>
  );
}

/** `filters` is the object returned by usePatientFilters(). */
export default function FilterBar({ filters, searchInputRef }) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Wired up ⌘K shortcut) */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchQuery}
            onChange={(e) => filters.setSearchQuery(e.target.value)}
            placeholder="Search patient by name, ID (e.g. P101), physician, or ward..."
            className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 pl-10 pr-20 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => {
                  filters.setSearchQuery('');
                  searchInputRef?.current?.focus();
                }}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Sort & View Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => filters.setSortBy(e.target.value)}
              aria-label="Sort patients"
              className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 pl-8 pr-8 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex h-10 items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 p-1">
            {VIEW_OPTIONS.map(({ mode, title, Icon }) => (
              <button
                key={mode}
                onClick={() => filters.setViewMode(mode)}
                title={title}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  filters.viewMode === mode
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/70">
        <div className="flex flex-wrap items-center gap-4">
          <PillGroup
            label="Status"
            options={['All', 'Active', 'Discharged']}
            value={filters.statusFilter}
            onChange={filters.setStatusFilter}
          />
          <PillGroup
            label="Ward"
            options={filters.availableWards}
            value={filters.wardFilter}
            onChange={filters.setWardFilter}
            getLabel={(ward) => (ward === 'All' ? 'All Wards' : `Ward ${ward}`)}
            activeClass="bg-indigo-600 text-white shadow-sm"
          />
          <PillGroup
            label="Billing"
            options={['All', 'Outstanding', 'Settled']}
            value={filters.balanceFilter}
            onChange={filters.setBalanceFilter}
          />
        </div>

        {filters.hasActiveFilters && (
          <button
            onClick={filters.resetFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset filters
          </button>
        )}
      </div>
    </Card>
  );
}
