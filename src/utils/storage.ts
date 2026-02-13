// Simple storage using public/scrapbooks.json
// Read from deployed file, write to localStorage

import type { Scrapbook } from '../types';

export interface ScrapbookMetadata {
  version: string;
  scrapbooks: {
    [year: number]: Scrapbook;
  };
}

// Read scrapbooks.json from public folder
export const loadScrapbooks = async (): Promise<ScrapbookMetadata> => {
  try {
    // Add cache-busting parameter
    const response = await fetch(`/scrapbooks.json?t=${Date.now()}`);
    
    if (!response.ok) {
      return {
        version: '1.0',
        scrapbooks: {},
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to load scrapbooks:', error);
    return {
      version: '1.0',
      scrapbooks: {},
    };
  }
};

// Download scrapbooks.json for manual commit
export const downloadScrapbooks = (data: ScrapbookMetadata) => {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scrapbooks.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Save to localStorage as backup
export const saveScrapbooks = async (data: ScrapbookMetadata): Promise<boolean> => {
  try {
    localStorage.setItem('scrapbookData', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save scrapbooks:', error);
    return false;
  }
};
