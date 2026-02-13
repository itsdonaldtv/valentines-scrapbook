import React from 'react';
import styled from 'styled-components';
import { useScrapbook } from '../contexts/ScrapbookContext';
import { useAuth } from '../contexts/AuthContext';
import { uploadImageToGitHub, getImageUrl } from '../utils/github';
import { CottageColors, CottageSpacing, CottageRadius, CottageShadow } from '../styles/theme';
import { CottageButton } from './CottageButton';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Container = styled.div`
  margin-top: ${CottageSpacing.xl};

  @media (max-width: 768px) {
    margin-top: ${CottageSpacing.lg};
  }
`;

const Title = styled.h2`
  font-size: 32px;
  color: ${CottageColors.primary};
  margin-bottom: ${CottageSpacing.lg};
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: ${CottageSpacing.md};
  }
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${CottageSpacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${CottageSpacing.md};
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${CottageSpacing.sm};
  }
`;

const MonthCard = styled.div`
  background: ${CottageColors.white};
  border-radius: ${CottageRadius.lg};
  overflow: hidden;
  box-shadow: ${CottageShadow.md};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 2px solid ${CottageColors.secondary};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${CottageShadow.lg};
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-3px);
    }
  }
`;

const MonthHeader = styled.div`
  background: linear-gradient(135deg, ${CottageColors.primary}, ${CottageColors.darkPink});
  color: white;
  padding: ${CottageSpacing.md};
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 14px;

  @media (max-width: 768px) {
    padding: ${CottageSpacing.sm};
    font-size: 12px;
  }
`;

const PhotoArea = styled.div`
  aspect-ratio: 1;
  background: linear-gradient(135deg, ${CottageColors.lightPink}, ${CottageColors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EmptyPlaceholder = styled.div`
  text-align: center;
  color: ${CottageColors.text};
  opacity: 0.5;
  font-size: 32px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CardFooter = styled.div`
  padding: ${CottageSpacing.md};
  display: flex;
  gap: ${CottageSpacing.sm};
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: ${CottageSpacing.sm};
    gap: ${CottageSpacing.xs};
  }
`;

const UploadInput = styled.input`
  display: none;
`;

export const MonthlyPhotos: React.FC = () => {
  const { currentScrapbook, addPhoto, removePhoto } = useScrapbook();
  const { isAuthenticated, isGuest } = useAuth();
  const [uploadingMonth, setUploadingMonth] = React.useState<number | null>(null);

  if (!currentScrapbook) {
    return (
      <Container>
        <Title>📸 Monthly Memories</Title>
        <div style={{ textAlign: 'center', padding: CottageSpacing.xxl, color: CottageColors.text }}>
          Select or create a year to get started
        </div>
      </Container>
    );
  }

  const photosByMonth = new Map<number, string>();
  currentScrapbook.photos.forEach((photo) => {
    photosByMonth.set(photo.month, photo.url);
  });

  const handlePhotoUpload = async (month: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingMonth(month);
      try {
        const result = await uploadImageToGitHub(file, currentScrapbook.year, month);
        if (result.success) {
          const existingPhoto = currentScrapbook.photos.find((p) => p.month === month);
          if (existingPhoto) {
            removePhoto(existingPhoto.id);
          }
          addPhoto({
            id: `photo-${month}-${Date.now()}`,
            url: result.url,
            month: month as any,
            uploadedAt: new Date().toISOString(),
          });
        } else {
          alert(`Failed to upload: ${result.error}`);
        }
      } catch (error) {
        alert('Error uploading photo');
        console.error(error);
      } finally {
        setUploadingMonth(null);
      }
    }
  };

  return (
    <Container>
      <Title>📸 Monthly Memories</Title>
      <MonthGrid>
        {MONTHS.map((monthName, index) => {
          const month = index + 1;
          const photoUrl = photosByMonth.get(month) || getImageUrl(currentScrapbook.year, month);
          const isUploading = uploadingMonth === month;

          return (
            <MonthCard key={month}>
              <MonthHeader>{monthName}</MonthHeader>
              <PhotoArea>
                {photoUrl ? (
                  <img src={photoUrl} alt={monthName} onError={() => {}} />
                ) : (
                  <EmptyPlaceholder>+</EmptyPlaceholder>
                )}
              </PhotoArea>
              <CardFooter>
                {!isGuest && isAuthenticated && (
                  <>
                    <UploadInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(month, e)}
                      id={`upload-${month}`}
                      disabled={isUploading}
                    />
                    <label htmlFor={`upload-${month}`} style={{ width: '100%' }}>
                      <CottageButton
                        size="sm"
                        onClick={() => document.getElementById(`upload-${month}`)?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? '⏳' : photoUrl ? '📷' : '📷'}
                      </CottageButton>
                    </label>
                    {photoUrl && (
                      <CottageButton
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          const photo = currentScrapbook.photos.find((p) => p.month === month);
                          if (photo) removePhoto(photo.id);
                        }}
                        disabled={isUploading}
                      >
                        ✕
                      </CottageButton>
                    )}
                  </>
                )}
              </CardFooter>
            </MonthCard>
          );
        })}
      </MonthGrid>
    </Container>
  );
};
