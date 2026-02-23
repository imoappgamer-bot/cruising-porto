import React, { useState, forwardRef } from 'react';
import './Input.css';

/**
 * Input Component
 * Campo de entrada reutilizável com validação e estados
 * 
 * Props:
 * - type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' (default: 'text')
 * - variant: 'textarea' para área de texto
 * - label: texto do rótulo
 * - placeholder: texto de exemplo
 * - value: valor controlado
 * - onChange: função callback quando valor muda
 * - error: mensagem de erro
 * - success: mensagem de sucesso
 * - disabled: boolean - desabilita o campo
 * - required: boolean - campo obrigatório
 * - icon: React node - ícone opcional
 * - iconPosition: 'left' | 'right' (default: 'left')
 * - helperText: texto de ajuda
 * - maxLength: número máximo de caracteres
 * - rows: número de linhas para textarea (default: 4)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - fullWidth: boolean - ocupa toda largura
 * - className: classes CSS adicionais
 */

const Input = forwardRef(({
  type = 'text',
  variant,
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon = null,
  iconPosition = 'left',
  helperText,
  maxLength,
  rows = 4,
  size = 'medium',
  fullWidth = false,
  className = '',
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Construir classes CSS para container
  const containerClasses = [
    'input-container',
    fullWidth && 'input-full-width',
    className
  ].filter(Boolean).join(' ');

  // Construir classes CSS para wrapper
  const wrapperClasses = [
    'input-wrapper',
    `input-${size}`,
    error && 'input-error',
    success && 'input-success',
    disabled && 'input-disabled',
    isFocused && 'input-focused',
    icon && `input-with-icon-${iconPosition}`
  ].filter(Boolean).join(' ');

  // Determinar tipo de input (toggle para password)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Handler para mudanças
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  // Handler para focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handler para blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Renderizar input ou textarea
  const renderInput = () => {
    const commonProps = {
      value,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled,
      placeholder,
      required,
      maxLength,
      ref,
      'aria-invalid': !!error,
      'aria-describedby': helperText || error ? 'input-helper' : undefined,
      ...rest
    };

    if (variant === 'textarea') {
      return (
        <textarea
          {...commonProps}
          rows={rows}
          className="input-field input-textarea"
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={inputType}
        className="input-field"
      />
    );
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required" aria-label="obrigatório">*</span>}
        </label>
      )}
      
      <div className={wrapperClasses}>
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}
        
        {renderInput()}
        
        {type === 'password' && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? (
              <span>👁️</span>
            ) : (
              <span>👁️‍🗨️</span>
            )}
          </button>
        )}
        
        {icon && iconPosition === 'right' && !type.includes('password') && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>

      {maxLength && value && (
        <div className="input-counter">
          {value.length} / {maxLength}
        </div>
      )}

      {(error || success || helperText) && (
        <div id="input-helper" className="input-helper">
          {error && <span className="input-error-text">{error}</span>}
          {success && !error && <span className="input-success-text">{success}</span>}
          {helperText && !error && !success && (
            <span className="input-helper-text">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
