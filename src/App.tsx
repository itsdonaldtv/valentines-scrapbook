import { ScrapbookProvider } from './contexts/ScrapbookContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CottageLayout } from './components/CottageLayout';
import { ScrapbookEditor } from './components/ScrapbookEditor';
import { LoginPage } from './components/LoginPage';
import { CottageButton } from './components/CottageButton';
import styled from 'styled-components';
import { CottageColors, CottageSpacing } from './styles/theme';
import './styles/global.css';

const LogoutContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${CottageSpacing.md};
  gap: ${CottageSpacing.md};

  @media (max-width: 768px) {
    padding: ${CottageSpacing.sm};
  }
`;

const GuestBadge = styled.div`
  background: ${CottageColors.lightGreen};
  color: ${CottageColors.text};
  padding: ${CottageSpacing.sm} ${CottageSpacing.md};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

function AppContent() {
  const { isAuthenticated, logout, isGuest } = useAuth();

  if (!isAuthenticated && !isGuest) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  return (
    <>
      {(isAuthenticated || isGuest) && (
        <LogoutContainer>
          {isGuest && <GuestBadge>👁️ Guest View</GuestBadge>}
          {isAuthenticated && (
            <CottageButton
              size="sm"
              variant="secondary"
              onClick={() => {
                logout();
                window.location.href = window.location.pathname;
              }}
            >
              Logout
            </CottageButton>
          )}
        </LogoutContainer>
      )}
      <CottageLayout title="Valentine's Scrapbook">
        <ScrapbookEditor />
      </CottageLayout>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ScrapbookProvider>
        <AppContent />
      </ScrapbookProvider>
    </AuthProvider>
  );
}

export default App;
