import React, { useState } from 'react';
import styled from 'styled-components';
import { useScrapbook } from '../contexts/ScrapbookContext';
import { useAuth } from '../contexts/AuthContext';
import { CottageColors, CottageSpacing, CottageRadius, CottageShadow } from '../styles/theme';
import { CottageButton } from './CottageButton';
import { CottageCard } from './CottageCard';

const Container = styled.div`
  margin-top: ${CottageSpacing.xl};
  margin-bottom: ${CottageSpacing.xl};

  @media (max-width: 768px) {
    margin-top: ${CottageSpacing.lg};
    margin-bottom: ${CottageSpacing.lg};
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

const PlayerContainer = styled.div`
  background: ${CottageColors.white};
  border-radius: ${CottageRadius.lg};
  padding: ${CottageSpacing.lg};
  box-shadow: ${CottageShadow.md};
  border: 2px solid ${CottageColors.secondary};
`;

const IframeWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: ${CottageRadius.md};
  margin-bottom: ${CottageSpacing.lg};

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: ${CottageRadius.md};
  }
`;

const SongForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${CottageSpacing.md};

  @media (max-width: 768px) {
    gap: ${CottageSpacing.sm};
  }
`;

const Input = styled.input`
  padding: ${CottageSpacing.md};
  border-radius: ${CottageRadius.md};
  border: 2px solid ${CottageColors.secondary};
  background-color: ${CottageColors.white};
  color: ${CottageColors.text};
  font-size: 16px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:focus {
    border-color: ${CottageColors.primary};
    box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
  }

  &::placeholder {
    color: ${CottageColors.text};
    opacity: 0.4;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${CottageSpacing.md};

  @media (max-width: 768px) {
    gap: ${CottageSpacing.sm};
    flex-wrap: wrap;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${CottageSpacing.xxl};
  background: linear-gradient(135deg, ${CottageColors.lightGreen}, ${CottageColors.lightPink});
  border-radius: ${CottageRadius.lg};
  color: ${CottageColors.text};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${CottageSpacing.md};
`;

export const SongPlayer: React.FC = () => {
  const { currentScrapbook, addSong, removeSong } = useScrapbook();
  const { isGuest, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAddSong = () => {
    setError('');

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    addSong({
      videoId,
      title: 'Valentine\'s Song',
      url: youtubeUrl,
      addedAt: new Date().toISOString(),
    });

    setYoutubeUrl('');
    setShowForm(false);
  };

  if (!currentScrapbook) {
    return (
      <Container>
        <Title>🎵 Valentine's Song</Title>
        <EmptyState>
          <EmptyIcon>🎶</EmptyIcon>
          <p>Select or create a year to add a song</p>
        </EmptyState>
      </Container>
    );
  }

  if (!currentScrapbook.song) {
    return (
      <Container>
        <Title>🎵 Valentine's Song</Title>
        {!isGuest && isAuthenticated && (
          <CottageCard variant="accent" padding="lg">
            {!showForm ? (
              <CottageButton onClick={() => setShowForm(true)} size="md">
                🎵 Add Your Song
              </CottageButton>
            ) : (
              <SongForm>
                <Input
                  type="text"
                  placeholder="Paste YouTube URL (youtube.com/watch?v=... or youtu.be/...)"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  autoFocus
                />
                {error && <div style={{ color: '#e74c3c', fontSize: '14px', fontWeight: 500 }}>{error}</div>}
                <ButtonGroup>
                  <CottageButton onClick={handleAddSong} size="sm">
                    Add Song
                  </CottageButton>
                  <CottageButton
                    onClick={() => {
                      setShowForm(false);
                      setError('');
                      setYoutubeUrl('');
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    Cancel
                  </CottageButton>
                </ButtonGroup>
              </SongForm>
            )}
          </CottageCard>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Title>🎵 Valentine's Song</Title>
      <PlayerContainer>
        <IframeWrapper>
          <iframe
            src={`https://www.youtube.com/embed/${currentScrapbook.song.videoId}`}
            title={currentScrapbook.song.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </IframeWrapper>
        {!isGuest && isAuthenticated && (
          <CottageButton
            onClick={() => removeSong()}
            size="sm"
            variant="secondary"
          >
            🗑️ Remove Song
          </CottageButton>
        )}
      </PlayerContainer>
    </Container>
  );
};
