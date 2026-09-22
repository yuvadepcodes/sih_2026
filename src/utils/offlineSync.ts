import { OfflineInspectionDraft } from '../types';

const STORAGE_KEY = 'lm_offline_inspections_v1';

export function getOfflineDrafts(): OfflineInspectionDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load offline drafts:', err);
    return [];
  }
}

export function saveOfflineDraft(draft: OfflineInspectionDraft): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getOfflineDrafts();
    const index = existing.findIndex((d) => d.id === draft.id || d.inspectionId === draft.inspectionId);
    if (index >= 0) {
      existing[index] = draft;
    } else {
      existing.unshift(draft);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Failed to save offline draft:', err);
  }
}

export function markDraftAsSynced(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const drafts = getOfflineDrafts();
    const updated = drafts.map((d) => (d.id === id ? { ...d, isSynced: true } : d));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to update sync status:', err);
  }
}

export function deleteOfflineDraft(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const drafts = getOfflineDrafts().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (err) {
    console.warn('Failed to delete draft:', err);
  }
}
