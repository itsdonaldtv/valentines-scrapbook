export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Photo {
  id: string;
  url: string;
  month: Month;
  title?: string;
  uploadedAt: string;
}

export interface YouTubeSong {
  videoId: string;
  title: string;
  url: string;
  addedAt: string;
}

export interface Scrapbook {
  year: number;
  photos: Photo[];
  song?: YouTubeSong;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapbookData {
  version: string;
  scrapbooks: {
    [year: number]: Scrapbook;
  };
  sharedLinks: {
    [linkId: string]: {
      id: string;
      year: number;
      createdAt: string;
      expiresAt?: string;
    };
  };
}

export interface SharedLink {
  id: string;
  scrapbookYear: number;
  createdAt: string;
  expiresAt?: string;
}
