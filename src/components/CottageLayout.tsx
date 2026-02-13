import React from 'react';
import styled from 'styled-components';
import { CottageColors, CottageSpacing } from '../styles/theme';

interface CottageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${CottageColors.background} 0%, ${CottageColors.secondary} 50%, #FFE8F0 100%);
  padding: ${CottageSpacing.md};
  position: relative;
  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: ${CottageSpacing.lg};
  }

  &::before {
    content: '💕';
    position: fixed;
    top: 20px;
    right: 30px;
    font-size: 24px;
    opacity: 0.3;
    animation: float 3s ease-in-out infinite;
    z-index: 0;

    @media (max-width: 768px) {
      font-size: 20px;
      top: 10px;
      right: 15px;
    }
  }

  &::after {
    content: '🌸';
    position: fixed;
    bottom: 40px;
    left: 30px;
    font-size: 20px;
    opacity: 0.3;
    animation: float 4s ease-in-out infinite;
    z-index: 0;

    @media (max-width: 768px) {
      font-size: 16px;
      bottom: 20px;
      left: 15px;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${CottageSpacing.xl};
  padding: ${CottageSpacing.lg} 0;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: ${CottageSpacing.lg};
    padding: ${CottageSpacing.md} 0;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  color: ${CottageColors.primary};
  margin-bottom: ${CottageSpacing.md};
  text-shadow: 2px 2px 0px rgba(255, 182, 217, 0.2);
  letter-spacing: 2px;
  font-weight: 900;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: ${CottageSpacing.sm};
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${CottageColors.text};
  opacity: 0.7;
  font-weight: 300;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const CottageLayout: React.FC<CottageLayoutProps> = ({ children, title }) => {
  return (
    <Container>
      {title && (
        <Header>
          <Title>💕 {title}</Title>
          <Subtitle>Your Valentine's Memories</Subtitle>
        </Header>
      )}
      <Content>{children}</Content>
    </Container>
  );
};
