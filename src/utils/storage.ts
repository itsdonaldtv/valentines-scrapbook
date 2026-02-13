// GitHub-based storage for scrapbook metadata
const GITHUB_OWNER = 'itsdonaldtv';
const GITHUB_REPO = 'valentines-scrapbook';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const SCRAPBOOKS_FILE = 'scrapbooks.json';

export interface ScrapbookMetadata {
  version: string;
  scrapbooks: {
    [year: number]: {
      year: number;
      photos: Array<{
        id: string;
        month: number;
        url: string;
        uploadedAt: string;
      }>;
      song?: {
        id: string;
        url: string;
        videoId: string;
        addedAt: string;
      };
      createdAt: string;
      updatedAt: string;
    };
  };
}

// Read scrapbooks.json from GitHub (public, no auth needed)
export const loadScrapbooks = async (): Promise<ScrapbookMetadata> => {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${SCRAPBOOKS_FILE}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      // File doesn't exist yet, return empty structure
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

// Save scrapbooks.json to GitHub (requires auth token)
export const saveScrapbooks = async (data: ScrapbookMetadata): Promise<boolean> => {
  if (!GITHUB_TOKEN) {
    console.error('GitHub token not configured');
    return false;
  }

  try {
    const content = JSON.stringify(data, null, 2);
    const base64Content = btoa(content);

    // Get current file SHA if it exists
    let sha: string | undefined;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SCRAPBOOKS_FILE}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }
    } catch {
      // File doesn't exist yet
    }

    // Update or create file
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SCRAPBOOKS_FILE}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update scrapbooks data',
          content: base64Content,
          ...(sha && { sha }),
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to save scrapbooks:', error);
    return false;
  }
};
