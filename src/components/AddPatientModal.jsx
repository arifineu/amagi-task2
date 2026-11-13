import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Card } from './ui';

const EMPTY_FORM = {
  name: '',
  ward: 'A',
  status: 'Active',
  balance: '',
  physician: 'Dr. R. Mendoza'
};

const inputClass =
  'h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm focus:border-indigo-500 focus:outline-none';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Register-new-patient dialog (shadcn Dialog style). */
export default function AddPatientModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onCreate(form);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Register New Patient
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Create an inpatient record with ward and billing details
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Full Name (Last, First) *">
            <input
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. Dela Cruz, Juan"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Ward Assignment">
              <select value={form.ward} onChange={update('ward')} className={inputClass}>
                {['A', 'B', 'C', 'D'].map((w) => (
                  <option key={w} value={w}>
                    Ward {w}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Admission Status">
              <select value={form.status} onChange={update('status')} className={inputClass}>
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Initial Balance (PHP)">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.balance}
                onChange={update('balance')}
                placeholder="0.00"
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field label="Attending Physician">
              <input
                type="text"
                value={form.physician}
                onChange={update('physician')}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Create Record
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
