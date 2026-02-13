import React, { useState } from 'react';
import styled from 'styled-components';
import { useScrapbook } from '../contexts/ScrapbookContext';
import { useAuth } from '../contexts/AuthContext';
import { CottageButton } from './CottageButton';
import { CottageCard } from './CottageCard';
import { CottageColors, CottageSpacing, CottageRadius } from '../styles/theme';

const Container = styled.div`
  display: flex;
  gap: ${CottageSpacing.xl};
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: ${CottageSpacing.xl};

  @media (max-width: 768px) {
    gap: ${CottageSpacing.md};
    flex-direction: column;
  }
`;

const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${CottageSpacing.md};
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: ${CottageSpacing.sm};
    width: 100%;
    min-width: unset;
  }
`;

const YearButton = styled.button<{ $isActive: boolean }>`
  padding: ${CottageSpacing.lg};
  border-radius: ${CottageRadius.md};
  border: 3px solid ${(props) => (props.$isActive ? CottageColors.primary : CottageColors.secondary)};
  background: ${(props) =>
    props.$isActive
      ? `linear-gradient(135deg, ${CottageColors.primary}, ${CottageColors.darkPink})`
      : CottageColors.white};
  color: ${(props) => (props.$isActive ? 'white' : CottageColors.text)};
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 1px;
  position: relative;

  @media (max-width: 768px) {
    padding: ${CottageSpacing.md};
    font-size: 16px;
    min-height: 44px;
  }

  &:hover {
    border-color: ${CottageColors.primary};
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CreateYearForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${CottageSpacing.md};
  min-width: 250px;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
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
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: ${CottageSpacing.sm};
  font-weight: 500;
`;

export const YearSelector: React.FC = () => {
  const { scrapbooks, currentYear, selectYear, createYear, deleteYear } = useScrapbook();
  const { isGuest, isAuthenticated } = useAuth();
  const [newYear, setNewYear] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreateYear = () => {
    const year = parseInt(newYear, 10);
    setError('');

    if (!newYear) {
      setError('Please enter a year');
      return;
    }

    if (isNaN(year) || year < 1900 || year > 2100) {
      setError('Please enter a valid year (1900-2100)');
      return;
    }

    if (scrapbooks.some((s) => s.year === year)) {
      setError('This year already exists');
      return;
    }

    createYear(year);
    setNewYear('');
    setShowForm(false);
  };

  const handleDeleteYear = (year: number) => {
    if (window.confirm(`Are you sure you want to delete the ${year} scrapbook?`)) {
      deleteYear(year);
    }
  };

  return (
    <Container>
      <YearGrid>
        {scrapbooks.map((scrapbook) => (
          <div key={scrapbook.year} style={{ position: 'relative' }}>
            <YearButton
              $isActive={currentYear === scrapbook.year}
              onClick={() => selectYear(scrapbook.year)}
            >
              {scrapbook.year}
            </YearButton>
            {!isGuest && isAuthenticated && currentYear === scrapbook.year && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                }}
              >
                <CottageButton
                  size="sm"
                  onClick={() => handleDeleteYear(scrapbook.year)}
                >
                  ✕
                </CottageButton>
              </div>
            )}
          </div>
        ))}
      </YearGrid>

      {!isGuest && isAuthenticated && (
        <CottageCard variant="light" padding="md">
          {!showForm ? (
            <CottageButton onClick={() => setShowForm(true)} size="md">
              ✨ Add New Year
            </CottageButton>
          ) : (
            <CreateYearForm>
              <Input
                type="number"
                placeholder="Enter year (e.g., 2025)"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                min="1900"
                max="2100"
                autoFocus
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <ButtonGroup>
                <CottageButton onClick={handleCreateYear} size="sm">
                  Create
                </CottageButton>
                <CottageButton
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                    setNewYear('');
                  }}
                  size="sm"
                  variant="secondary"
                >
                  Cancel
                </CottageButton>
              </ButtonGroup>
            </CreateYearForm>
          )}
        </CottageCard>
      )}
    </Container>
  );
};
