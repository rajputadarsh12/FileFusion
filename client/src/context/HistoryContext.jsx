import React, { createContext, useContext, useEffect, useState } from 'react';

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [recentToolIds, setRecentToolIds] = useState(() => {
    try {
      const saved = localStorage.getItem('filefusion-recents');
      return saved ? JSON.parse(saved) : ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'edit-pdf'];
    } catch (e) {
      return ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'edit-pdf'];
    }
  });

  const recordToolUsage = (toolId) => {
    setRecentToolIds((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 6);
      localStorage.setItem('filefusion-recents', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <HistoryContext.Provider value={{ recentToolIds, recordToolUsage }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
