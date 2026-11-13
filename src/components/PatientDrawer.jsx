import { useState } from 'react';
import { CreditCard, FileText, X } from 'lucide-react';
import { formatPHP, getInitials } from '../lib/utils';
import { Badge, BalanceAmount, Button, StatusBadge } from './ui';

const tileClass =
  'rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 bg-zinc-50/50 dark:bg-zinc-900/50';
const tileLabelClass = 'text-[11px] uppercase tracking-wider text-zinc-400 font-medium';

/**
 * Slide-over drawer (shadcn Sheet style) with patient details, billing and actions.
 * Render with key={patient.id} so the payment input resets per patient.
 */
export default function PatientDrawer({
  patient,
  onClose,
  onToggleStatus,
  onRecordPayment,
  onSettleFullBalance
}) {
  const [paymentInput, setPaymentInput] = useState('');
  const hasBalance = patient.balance > 0;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentInput);
    if (isNaN(amount) || amount <= 0) return;
    onRecordPayment(patient.id, amount);
    setPaymentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold">
              {getInitials(patient.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {patient.name}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Attending: {patient.physician}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="py-6 space-y-6 flex-1">
          {/* Status & Ward */}
          <div className="grid grid-cols-2 gap-3">
            <div className={tileClass}>
              <span className={tileLabelClass}>Current Status</span>
              <div className="mt-2">
                <StatusBadge status={patient.status} />
              </div>
            </div>
            <div className={tileClass}>
              <span className={tileLabelClass}>Assigned Location</span>
              <p className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Ward {patient.ward} • Room {patient.room}
              </p>
            </div>
          </div>

          {/* Balance & Payment */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Account Balance
                </span>
                <BalanceAmount
                  amount={patient.balance}
                  className="block text-2xl font-bold font-mono mt-0.5"
                />
              </div>
              <Badge variant={hasBalance ? 'warning' : 'settled'}>
                {hasBalance ? 'Payment Due' : 'Settled'}
              </Badge>
            </div>

            {hasBalance && (
              <form
                onSubmit={handlePaymentSubmit}
                className="space-y-2.5 pt-2 border-t border-zinc-200/70 dark:border-zinc-800"
              >
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Record Partial or Full Payment (PHP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={patient.balance}
                    value={paymentInput}
                    onChange={(e) => setPaymentInput(e.target.value)}
                    placeholder="Enter amount..."
                    className="h-9 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  <Button type="submit" size="sm" className="h-9">
                    <CreditCard className="h-3.5 w-3.5" />
                    Apply
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => onSettleFullBalance(patient.id)}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Mark entire {formatPHP(patient.balance)} as paid in full
                </button>
              </form>
            )}
          </div>

          {/* Clinical Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <FileText className="h-3.5 w-3.5" />
              Clinical & Billing Notes
            </div>
            <p className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/40 p-3.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {patient.notes}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex items-center justify-between gap-3">
          <Button variant="outline" className="w-full" onClick={() => onToggleStatus(patient.id)}>
            {patient.status === 'Active' ? 'Discharge Patient' : 'Re-Admit to Active'}
          </Button>
          <Button className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
