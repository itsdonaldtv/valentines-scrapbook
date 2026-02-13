import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Scrapbook, ScrapbookData, Photo, YouTubeSong } from '../types';
import { loadScrapbooks, saveScrapbooks, type ScrapbookMetadata } from '../utils/storage';

interface ScrapbookContextType {
  scrapbooks: Scrapbook[];
  currentYear: number | null;
  currentScrapbook: Scrapbook | null;
  createYear: (year: number) => void;
  deleteYear: (year: number) => void;
  selectYear: (year: number) => void;
  addPhoto: (photo: Photo) => void;
  removePhoto: (photoId: string) => void;
  addSong: (song: YouTubeSong) => void;
  removeSong: () => void;
}

const ScrapbookContext = createContext<ScrapbookContextType | undefined>(undefined);

export const ScrapbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrapbookData, setScrapbookData] = useState<ScrapbookData>({
    version: '1.0',
    scrapbooks: {},
    sharedLinks: {},
  });
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from GitHub on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadScrapbooks();
        setScrapbookData({
          version: data.version,
          scrapbooks: data.scrapbooks,
          sharedLinks: {},
        });
        const years = Object.keys(data.scrapbooks).map(Number);
        if (years.length > 0) {
          setCurrentYear(years[0]);
        }
      } catch (error) {
        console.error('Failed to load scrapbook data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save to GitHub whenever data changes (debounced)
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load
    
    const saveData = async () => {
      const metadata: ScrapbookMetadata = {
        version: scrapbookData.version,
        scrapbooks: scrapbookData.scrapbooks,
      };
      await saveScrapbooks(metadata);
    };
    
    const timeoutId = setTimeout(saveData, 1000); // Debounce saves by 1 second
    return () => clearTimeout(timeoutId);
  }, [scrapbookData, isLoading]);

  const createYear = useCallback((year: number) => {
    setScrapbookData((prev) => {
      if (prev.scrapbooks[year]) return prev;
      return {
        ...prev,
        scrapbooks: {
          ...prev.scrapbooks,
          [year]: {
            year,
            photos: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
    setCurrentYear(year);
  }, []);

  const deleteYear = useCallback((year: number) => {
    setScrapbookData((prev) => {
      const newScrapbooks = { ...prev.scrapbooks };
      delete newScrapbooks[year];
      return {
        ...prev,
        scrapbooks: newScrapbooks,
      };
    });
    if (currentYear === year) {
      const remainingYears = Object.keys(scrapbookData.scrapbooks)
        .map(Number)
        .filter((y) => y !== year);
      setCurrentYear(remainingYears.length > 0 ? remainingYears[0] : null);
    }
  }, [currentYear, scrapbookData.scrapbooks]);

  const selectYear = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  const addPhoto = useCallback((photo: Photo) => {
    if (!currentYear) return;
    setScrapbookData((prev) => {
      const scrapbook = prev.scrapbooks[currentYear];
      if (!scrapbook) return prev;
      return {
        ...prev,
        scrapbooks: {
          ...prev.scrapbooks,
          [currentYear]: {
            ...scrapbook,
            photos: [...scrapbook.photos, photo],
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [currentYear]);

  const removePhoto = useCallback((photoId: string) => {
    if (!currentYear) return;
    setScrapbookData((prev) => {
      const scrapbook = prev.scrapbooks[currentYear];
      if (!scrapbook) return prev;
      return {
        ...prev,
        scrapbooks: {
          ...prev.scrapbooks,
          [currentYear]: {
            ...scrapbook,
            photos: scrapbook.photos.filter((p) => p.id !== photoId),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [currentYear]);

  const addSong = useCallback((song: YouTubeSong) => {
    if (!currentYear) return;
    setScrapbookData((prev) => {
      const scrapbook = prev.scrapbooks[currentYear];
      if (!scrapbook) return prev;
      return {
        ...prev,
        scrapbooks: {
          ...prev.scrapbooks,
          [currentYear]: {
            ...scrapbook,
            song,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [currentYear]);

  const removeSong = useCallback(() => {
    if (!currentYear) return;
    setScrapbookData((prev) => {
      const scrapbook = prev.scrapbooks[currentYear];
      if (!scrapbook) return prev;
      const { song, ...rest } = scrapbook;
      return {
        ...prev,
        scrapbooks: {
          ...prev.scrapbooks,
          [currentYear]: {
            ...rest,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [currentYear]);

  const scrapbooks = Object.values(scrapbookData.scrapbooks).sort((a, b) => b.year - a.year);
  const currentScrapbook = currentYear ? scrapbookData.scrapbooks[currentYear] : null;

  return (
    <ScrapbookContext.Provider
      value={{
        scrapbooks,
        currentYear,
        currentScrapbook,
        createYear,
        deleteYear,
        selectYear,
        addPhoto,
        removePhoto,
        addSong,
        removeSong,
      }}
    >
      {children}
    </ScrapbookContext.Provider>
  );
};

export const useScrapbook = () => {
  const context = useContext(ScrapbookContext);
  if (!context) {
    throw new Error('useScrapbook must be used within ScrapbookProvider');
  }
  return context;
};
