import { useCallback, useMemo, useState } from 'react';

export function usePatientFilters(patients) {
  // Adding state for the search input query
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');
  const [balanceFilter, setBalanceFilter] = useState('All'); // All | Outstanding | Settled
  const [sortBy, setSortBy] = useState('id-asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' (stacked cards) | 'grid' | 'table'

  const availableWards = useMemo(() => {
    const wards = Array.from(new Set(patients.map((p) => p.ward))).sort();
    return ['All', ...wards];
  }, [patients]);

  const filteredPatients = useMemo(() => {
    // Incorporate search query matching (by name, ID, ward, or physician) into this filter
    const query = searchQuery.trim().toLowerCase();

    return patients
      .filter((p) => {
        const matchesSearch = !query ||
          [p.name, p.id, p.physician, `ward ${p.ward}`, p.room].some((field) =>
            field.toLowerCase().includes(query)
          );
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesWard = wardFilter === 'All' || p.ward === wardFilter;
        const matchesBalance =
          balanceFilter === 'All' ||
          (balanceFilter === 'Outstanding' && p.balance > 0) ||
          (balanceFilter === 'Settled' && p.balance === 0);

        return matchesSearch && matchesStatus && matchesWard && matchesBalance;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'balance-desc':
            return b.balance - a.balance;
          case 'balance-asc':
            return a.balance - b.balance;
          case 'id-asc':
          default:
            return a.id.localeCompare(b.id);
        }
      });
  }, [patients, searchQuery, statusFilter, wardFilter, balanceFilter, sortBy]);

  const resetFilters = useCallback(() => {
    // Also clear the search query state here
    setSearchQuery('');
    setStatusFilter('All');
    setWardFilter('All');
    setBalanceFilter('All');
    setSortBy('id-asc');
  }, []);

  // nclude active search query check once search state is implemented
  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    wardFilter !== 'All' ||
    balanceFilter !== 'All';

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    wardFilter,
    setWardFilter,
    balanceFilter,
    setBalanceFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    availableWards,
    filteredPatients,
    resetFilters,
    hasActiveFilters
  };
}
