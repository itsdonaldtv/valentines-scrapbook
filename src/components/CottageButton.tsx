import React from 'react';
import styled from 'styled-components';
import { CottageColors, CottageSpacing, CottageRadius, CottageShadow } from '../styles/theme';

interface CottageButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  padding: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return `${CottageSpacing.sm} ${CottageSpacing.md}`;
      case 'lg':
        return `${CottageSpacing.lg} ${CottageSpacing.xl}`;
      default:
        return `${CottageSpacing.md} ${CottageSpacing.lg}`;
    }
  }};
  font-size: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '13px';
      case 'lg':
        return '18px';
      default:
        return '15px';
    }
  }};
  border-radius: ${CottageRadius.lg};
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return CottageColors.secondary;
      case 'accent':
        return CottageColors.accent;
      default:
        return CottageColors.primary;
    }
  }};
  color: ${(props) => (props.$variant === 'secondary' ? CottageColors.text : CottageColors.white)};
  font-weight: 600;
  box-shadow: ${CottageShadow.md};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.3s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: ${CottageShadow.lg};

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CottageButton: React.FC<CottageButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
};
