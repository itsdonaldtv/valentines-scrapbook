import React from 'react';
import styled from 'styled-components';
import { CottageColors, CottageSpacing, CottageRadius, CottageShadow } from '../styles/theme';

interface CottageCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'light' | 'accent';
  padding?: 'sm' | 'md' | 'lg';
}

const StyledCard = styled.div<{ $variant: string; $padding: string }>`
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'light':
        return CottageColors.lightPink;
      case 'accent':
        return CottageColors.lightGreen;
      default:
        return CottageColors.white;
    }
  }};
  border-radius: ${CottageRadius.lg};
  padding: ${(props) => {
    switch (props.$padding) {
      case 'sm':
        return CottageSpacing.md;
      case 'lg':
        return CottageSpacing.xl;
      default:
        return CottageSpacing.lg;
    }
  }};
  box-shadow: ${CottageShadow.md};
  border: 2px solid ${(props) => {
    switch (props.$variant) {
      case 'light':
        return CottageColors.lightPink;
      case 'accent':
        return CottageColors.lightGreen;
      default:
        return CottageColors.secondary;
    }
  }};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, ${CottageColors.primary}, ${CottageColors.accent});
    border-radius: ${CottageRadius.lg};
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow: ${CottageShadow.lg};
    transform: translateY(-4px);

    &::before {
      opacity: 0.1;
    }
  }
`;

export const CottageCard: React.FC<CottageCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
}) => {
  return (
    <StyledCard $variant={variant} $padding={padding}>
      {children}
    </StyledCard>
  );
};
