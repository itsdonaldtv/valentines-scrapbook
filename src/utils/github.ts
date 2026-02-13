// Cloudinary utility for storing images securely
// You'll need to set this environment variable:
// VITE_CLOUDINARY_CLOUD_NAME - Your Cloudinary cloud name (no secrets needed!)

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export interface GitHubUploadResult {
  success: boolean;
  path: string;
  url: string;
  error?: string;
}

export const uploadImageToGitHub = async (
  file: File,
  year: number,
  month: number
): Promise<GitHubUploadResult> => {
  if (!CLOUDINARY_CLOUD_NAME) {
    return {
      success: false,
      path: '',
      url: '',
      error: 'Cloudinary configuration not set. Add VITE_CLOUDINARY_CLOUD_NAME to .env',
    };
  }

  try {
    const monthNames = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    const monthName = monthNames[month - 1];
    const publicId = `valentines-scrapbook/${year}/${monthName}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('public_id', publicId);
    formData.append('upload_preset', 'valentines_scrapbook');

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      return {
        success: false,
        path: publicId,
        url: '',
        error: error.error?.message || 'Failed to upload to Cloudinary',
      };
    }

    const data = await uploadResponse.json();

    return {
      success: true,
      path: publicId,
      url: data.secure_url,
    };
  } catch (error) {
    return {
      success: false,
      path: '',
      url: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getImageUrl = (year: number, month: number): string => {
  if (!CLOUDINARY_CLOUD_NAME) {
    return '';
  }

  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  const monthName = monthNames[month - 1];
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/valentines-scrapbook/${year}/${monthName}`;
};
