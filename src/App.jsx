import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { INITIAL_PATIENTS } from './data/patients';
import { formatPHP } from './lib/utils';
import { usePatientFilters } from './hooks/usePatientFilters';
import { Toast } from './components/ui';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import PatientList from './components/PatientList';
import PatientDrawer from './components/PatientDrawer';
import AddPatientModal from './components/AddPatientModal';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filters = usePatientFilters(patients);

  // Escape closes overlays
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPatientId(null);
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-clear toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId) || null,
    [patients, selectedPatientId]
  );

  // Stats for the top cards
  const stats = useMemo(() => {
    const activeCount = patients.filter((p) => p.status === 'Active').length;
    const pendingAccounts = patients.filter((p) => p.balance > 0).length;

    return {
      totalPatients: patients.length,
      wardCount: new Set(patients.map((p) => p.ward)).size,
      activeCount,
      dischargedCount: patients.length - activeCount,
      outstandingTotal: patients.reduce((sum, p) => sum + p.balance, 0),
      pendingAccounts,
      clearedAccounts: patients.length - pendingAccounts
    };
  }, [patients]);

  const searchInputRef = useRef(null);
  const isOverlayOpen = selectedPatientId !== null || isAddModalOpen;

  // Keyboard shortuts: Cmd/Ctrl+K focuses search, Escape closes overlays
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPatientId(null);
        setIsAddModalOpen(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // stop the browser's own Ctrl+K (address-bar search)
        if (isOverlayOpen) return; // don't jump behind an open drawer/modal
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverlayOpen]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSelectPatient = useCallback((patient) => setSelectedPatientId(patient.id), []);

  const updatePatient = (patientId, changes) =>
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, ...changes } : p)));

  const handleToggleStatus = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    const nextStatus = patient.status === 'Active' ? 'Discharged' : 'Active';
    updatePatient(patientId, { status: nextStatus });
    setToastMessage(`${patient.name} marked as ${nextStatus}`);
  };

  const handleRecordPayment = (patientId, amount) => {
    const patient = patients.find((p) => p.id === patientId);
    updatePatient(patientId, {
      balance: Math.max(0, Number((patient.balance - amount).toFixed(2)))
    });
    setToastMessage(`Payment of ${formatPHP(amount)} recorded for ${patient.name}`);
  };

  const handleSettleFullBalance = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    updatePatient(patientId, { balance: 0 });
    setToastMessage(`Full balance settled for ${patient.name}`);
  };

  const handleCreatePatient = (form) => {
    const created = {
      id: `P${101 + patients.length}`,
      name: form.name.trim(),
      status: form.status,
      balance: Math.max(0, parseFloat(form.balance) || 0),
      ward: form.ward,
      room: `${form.ward}-${Math.floor(100 + Math.random() * 250)}`,
      admittedDate: '2026-11-12',
      physician: form.physician || 'Dr. R. Mendoza',
      notes: 'Newly registered patient record.'
    };

    setPatients((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setToastMessage(`Added ${created.name} (${created.id})`);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-indigo-500/20 selection:text-indigo-400">
        {/* Subtle Ambient Top Glow */}
        <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-500/[0.06] dark:from-indigo-500/[0.07] to-transparent" />

        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onAddPatient={() => setIsAddModalOpen(true)}
        />

        <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
          <StatsCard metrics={stats} />

          <FilterBar filters={filters} searchInputRef={searchInputRef} />

          {/* Results count — Replaced static 0s with filtered and total patient counts */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                { filters.filteredPatients.length }
              </span> of { stats.totalPatients }
              patient records
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
              Click any patient record to inspect billing or update status
            </p>
          </div>

          <PatientList
            patients={filters.filteredPatients}
            viewMode={filters.viewMode}
            onSelect={handleSelectPatient}
            onResetFilters={filters.resetFilters}
          />
        </main>

        {selectedPatient && (
          <PatientDrawer
            key={selectedPatient.id}
            patient={selectedPatient}
            onClose={() => setSelectedPatientId(null)}
            onToggleStatus={handleToggleStatus}
            onRecordPayment={handleRecordPayment}
            onSettleFullBalance={handleSettleFullBalance}
          />
        )}

        {isAddModalOpen && (
          <AddPatientModal
            onClose={() => setIsAddModalOpen(false)}
            onCreate={handleCreatePatient}
          />
        )}

        <Toast message={toastMessage} />
      </div>
    </div>
  );
}
