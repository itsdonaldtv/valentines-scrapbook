import React from 'react';
import styled from 'styled-components';
import { useScrapbook } from '../contexts/ScrapbookContext';
import { CottageColors, CottageSpacing, CottageRadius } from '../styles/theme';

const Container = styled.div`
  margin-top: ${CottageSpacing.xl};
`;

const Title = styled.h2`
  font-family: 'Georgia', serif;
  font-size: 28px;
  color: ${CottageColors.primary};
  margin-bottom: ${CottageSpacing.lg};
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${CottageSpacing.lg};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${CottageSpacing.xxl};
  background-color: ${CottageColors.lightPink};
  border-radius: ${CottageRadius.lg};
  color: ${CottageColors.text};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${CottageSpacing.md};
`;

export const PhotoGallery: React.FC = () => {
  const { currentScrapbook } = useScrapbook();

  if (!currentScrapbook) {
    return (
      <Container>
        <Title>📸 Photos</Title>
        <EmptyState>
          <EmptyIcon>🎨</EmptyIcon>
          <p>Select or create a year to get started</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>📸 Photos</Title>
      <Gallery>
        {currentScrapbook.photos.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📷</EmptyIcon>
            <p>No photos yet. Add your first photo to get started!</p>
          </EmptyState>
        ) : (
          currentScrapbook.photos.map((photo) => (
            <div key={photo.id}>
              <img
                src={photo.url}
                alt={photo.title || 'Photo'}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: CottageRadius.md,
                }}
              />
            </div>
          ))
        )}
      </Gallery>
    </Container>
  );
};
