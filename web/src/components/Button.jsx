import React from 'react';
import './Button.css';

/**
 * Button Component
 * Botão reutilizável com diferentes variantes e tamanhos
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' (default: 'primary')
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - fullWidth: boolean - botão ocupa toda a largura (default: false)
 * - disabled: boolean - desabilita o botão (default: false)
 * - loading: boolean - mostra estado de carregamento (default: false)
 * - icon: React node - ícone opcional antes do texto
 * - iconPosition: 'left' | 'right' (default: 'left')
 * - onClick: função callback ao clicar
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - className: classes CSS adicionais
 * - children: conteúdo do botão
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  // Construir classes CSS
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  // Handler para click
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className="btn-spinner" aria-label="A carregar">
          <span className="spinner"></span>
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn-icon btn-icon-left">{icon}</span>
          )}
          {children && <span className="btn-text">{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="btn-icon btn-icon-right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
