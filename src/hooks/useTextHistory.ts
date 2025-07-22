import { useState, useCallback } from 'react';

interface UseTextHistoryReturn {
  text: string;
  setText: (newText: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useTextHistory = (initialText: string = ''): UseTextHistoryReturn => {
  const [history, setHistory] = useState<string[]>([initialText]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setText = useCallback((newText: string) => {
    if (newText === history[currentIndex]) return;
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newText);
    
    // Ограничиваем историю 50 элементами
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    
    setHistory(newHistory);
    if (newHistory.length === 50) {
      setCurrentIndex(49);
    }
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  return {
    text: history[currentIndex] || '',
    setText,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};