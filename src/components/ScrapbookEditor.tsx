import React, { useState } from 'react';
import styled from 'styled-components';
import { useScrapbook } from '../contexts/ScrapbookContext';
import { useAuth } from '../contexts/AuthContext';
import { YearSelector } from './YearSelector';
import { MonthlyPhotos } from './MonthlyPhotos';
import { SongPlayer } from './SongPlayer';
import { CottageButton } from './CottageButton';
import { CottageSpacing, CottageColors } from '../styles/theme';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${CottageSpacing.xl};
`;

const ShareContainer = styled.div`
  display: flex;
  gap: ${CottageSpacing.md};
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: ${CottageSpacing.sm};
  }
`;

const CopyNotification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${CottageColors.primary};
  color: white;
  padding: ${CottageSpacing.md} ${CottageSpacing.lg};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    left: 10px;
  }
`;

export const ScrapbookEditor: React.FC = () => {
  const { currentScrapbook } = useScrapbook();
  const { isAuthenticated } = useAuth();
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const handleCopyGuestLink = () => {
    if (!currentScrapbook) return;

    const baseUrl = window.location.origin + window.location.pathname;
    const guestLink = `${baseUrl}?guest=true`;

    navigator.clipboard.writeText(guestLink).then(() => {
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    });
  };

  return (
    <EditorContainer>
      <YearSelector />
      {currentScrapbook && isAuthenticated && (
        <ShareContainer>
          <CottageButton onClick={handleCopyGuestLink} size="md">
            🔗 Copy Guest Link for {currentScrapbook.year}
          </CottageButton>
        </ShareContainer>
      )}
      {currentScrapbook && (
        <>
          <SongPlayer />
          <MonthlyPhotos />
        </>
      )}
      {showCopyNotification && (
        <CopyNotification>
          ✓ Guest link copied to clipboard!
        </CopyNotification>
      )}
    </EditorContainer>
  );
};
