import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { CottageButton } from './CottageButton';
import { CottageColors, CottageSpacing, CottageRadius } from '../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${CottageColors.background} 0%, ${CottageColors.secondary} 50%, #FFE8F0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${CottageSpacing.lg};

  @media (max-width: 768px) {
    padding: ${CottageSpacing.md};
  }
`;

const Card = styled.div`
  background: ${CottageColors.white};
  border-radius: ${CottageRadius.lg};
  padding: ${CottageSpacing.xxl};
  box-shadow: 0 12px 32px rgba(74, 63, 71, 0.15);
  max-width: 400px;
  width: 100%;
  border: 2px solid ${CottageColors.secondary};

  @media (max-width: 768px) {
    padding: ${CottageSpacing.lg};
    border-radius: ${CottageRadius.md};
  }
`;

const Title = styled.h1`
  font-size: 42px;
  color: ${CottageColors.primary};
  text-align: center;
  margin-bottom: ${CottageSpacing.md};
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${CottageColors.text};
  margin-bottom: ${CottageSpacing.xl};
  opacity: 0.7;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${CottageSpacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${CottageSpacing.sm};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${CottageColors.text};
  font-size: 14px;
  letter-spacing: 0.5px;
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

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  font-weight: 500;
  padding: ${CottageSpacing.md};
  background-color: #fadbd8;
  border-radius: ${CottageRadius.md};
  border-left: 4px solid #e74c3c;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${CottageSpacing.md};
`;

const GuestLink = styled.button`
  background: none;
  border: none;
  color: ${CottageColors.primary};
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  padding: 0;
  margin-top: ${CottageSpacing.md};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        onLoginSuccess?.();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    const guestLink = `${window.location.origin}${window.location.pathname}?guest=true`;
    window.location.href = guestLink;
  };

  return (
    <Container>
      <Card>
        <Title>💕</Title>
        <Subtitle>Valentine's Scrapbook</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonContainer>
            <CottageButton type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </CottageButton>
          </ButtonContainer>
        </Form>

        <GuestLink type="button" onClick={handleGuestAccess}>
          View as guest →
        </GuestLink>
      </Card>
    </Container>
  );
};
