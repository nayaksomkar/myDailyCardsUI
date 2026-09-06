import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'myDailyCards_interactions';

function loadInteractions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { likes: [], saves: [], shares: [] };
  } catch {
    return { likes: [], saves: [], shares: [] };
  }
}

function saveInteractions(interactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
  } catch {
    // ignore
  }
}

export default function useInteractions() {
  const [interactions, setInteractions] = useState(loadInteractions);

  useEffect(() => {
    saveInteractions(interactions);
  }, [interactions]);

  const toggleLike = useCallback((id) => {
    setInteractions((prev) => {
      const likes = prev.likes.includes(id)
        ? prev.likes.filter((x) => x !== id)
        : [...prev.likes, id];
      return { ...prev, likes };
    });
  }, []);

  const toggleSave = useCallback((id) => {
    setInteractions((prev) => {
      const saves = prev.saves.includes(id)
        ? prev.saves.filter((x) => x !== id)
        : [...prev.saves, id];
      return { ...prev, saves };
    });
  }, []);

  const toggleShare = useCallback((id) => {
    setInteractions((prev) => {
      const shares = prev.shares.includes(id)
        ? prev.shares.filter((x) => x !== id)
        : [...prev.shares, id];
      return { ...prev, shares };
    });
  }, []);

  const isLiked = useCallback((id) => interactions.likes.includes(id), [interactions.likes]);
  const isSaved = useCallback((id) => interactions.saves.includes(id), [interactions.saves]);
  const isShared = useCallback((id) => interactions.shares.includes(id), [interactions.shares]);

  return {
    toggleLike,
    toggleSave,
    toggleShare,
    isLiked,
    isSaved,
    isShared,
    likedCount: interactions.likes.length,
    savedCount: interactions.saves.length,
    savedIds: interactions.saves,
  };
}
