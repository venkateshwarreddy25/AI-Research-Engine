import { create } from 'zustand';

export const useSchemeStore = create((set) => ({
  filters: {
    category:      '',
    state:         '',
    gender:        '',
    minAge:        '',
    maxAge:        '',
    casteCategory: '',
    searchQuery:   '',
  },
  savedSchemeIds: [],
  compareList:    [],

  setFilter: (key, value) => set((s) => ({
    filters: { ...s.filters, [key]: value },
  })),

  resetFilters: () => set({
    filters: {
      category: '', state: '', gender: '',
      minAge: '', maxAge: '', casteCategory: '', searchQuery: '',
    },
  }),

  toggleSaved: (schemeId) => set((s) => ({
    savedSchemeIds: s.savedSchemeIds.includes(schemeId)
      ? s.savedSchemeIds.filter(id => id !== schemeId)
      : [...s.savedSchemeIds, schemeId],
  })),

  addToCompare: (schemeId) => set((s) => ({
    compareList: s.compareList.includes(schemeId) || s.compareList.length >= 3
      ? s.compareList
      : [...s.compareList, schemeId],
  })),

  removeFromCompare: (schemeId) => set((s) => ({
    compareList: s.compareList.filter(id => id !== schemeId),
  })),

  clearCompare: () => set({ compareList: [] }),
}));
