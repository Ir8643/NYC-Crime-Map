import { useState, useCallback, useRef, useEffect } from 'react';
import type { NormalizedIncident } from '../types';

interface UsePlaybackReturn {
  displayedIncidents: NormalizedIncident[];
  currentIndex: number;
  isPlaying: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function usePlayback(
  allIncidents: NormalizedIncident[],
  delay: number = 200
): UsePlaybackReturn {
  const [displayedIncidents, setDisplayedIncidents] = useState<NormalizedIncident[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (isPlaying || currentIndex >= allIncidents.length || allIncidents.length === 0) return;
    
    setIsPlaying(true);
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= allIncidents.length) {
          setIsPlaying(false);
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev;
        }
        const nextIncident = allIncidents[prev];
        if (nextIncident) {
          setDisplayedIncidents(prev => [...prev, nextIncident]);
        }
        return prev + 1;
      });
    }, delay);
  }, [allIncidents, currentIndex, isPlaying, delay]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setCurrentIndex(0);
    setDisplayedIncidents([]);
  }, [pause]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    displayedIncidents,
    currentIndex,
    isPlaying,
    start,
    pause,
    reset
  };
}

