import { useState, useEffect, useCallback } from 'react';

/**
 * useStorage — like useState but backed by localStorage.
 * Handles JSON serialization/deserialization automatically.
 */
export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback((newValue) => {
    setValue(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  const remove = useCallback(() => {
    try { localStorage.removeItem(key); } catch {}
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, set, remove];
}
