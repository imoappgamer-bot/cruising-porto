import React, { useState } from 'react';
import './Rating.css';

/**
 * Rating Component
 * Componente de avaliação com estrelas interativas
 * 
 * Props:
 * - value: número de 0-5 - avaliação atual (default: 0)
 * - maxStars: número máximo de estrelas (default: 5)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - readonly: boolean - apenas visualização (default: false)
 * - showValue: boolean - mostra valor numérico (default: false)
 * - onChange: função callback quando rating muda
 * - precision: 'full' | 'half' - precisão de avaliação (default: 'full')
 * - color: cor das estrelas preenchidas (default: '#fbbf24')
 * - emptyColor: cor das estrelas vazias (default: '#d1d5db')
 * - className: classes CSS adicionais
 */

const Rating = ({
  value = 0,
  maxStars = 5,
  size = 'medium',
  readonly = false,
  showValue = false,
  onChange,
  precision = 'full',
  color = '#fbbf24',
  emptyColor = '#d1d5db',
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(value);

  // Garantir que rating está entre 0 e maxStars
  const normalizedRating = Math.max(0, Math.min(currentRating, maxStars));
  const displayRating = hoverRating || normalizedRating;

  // Construir classes CSS
  const ratingClasses = [
    'rating',
    `rating-${size}`,
    readonly && 'rating-readonly',
    className
  ].filter(Boolean).join(' ');

  // Handler para click em estrela
  const handleStarClick = (starValue) => {
    if (readonly) return;

    setCurrentRating(starValue);
    if (onChange) {
      onChange(starValue);
    }
  };

  // Handler para hover em estrela
  const handleStarHover = (starValue) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  // Handler para mouse leave
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  // Calcular porcentagem de preenchimento para cada estrela
  const getStarFillPercentage = (starIndex) => {
    const starValue = starIndex + 1;
    
    if (displayRating >= starValue) {
      return 100;
    } else if (displayRating > starIndex && displayRating < starValue) {
      return (displayRating - starIndex) * 100;
    }
    return 0;
  };

  // Renderizar estrelas
  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < maxStars; i++) {
      const fillPercentage = getStarFillPercentage(i);
      const starValue = precision === 'half' ? (i + 0.5) : (i + 1);
      
      stars.push(
        <div
          key={i}
          className={`star ${!readonly ? 'star-interactive' : ''}`}
          onClick={() => handleStarClick(i + 1)}
          onMouseEnter={() => handleStarHover(i + 1)}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={readonly ? -1 : 0}
          aria-label={`Avaliar ${i + 1} de ${maxStars} estrelas`}
        >
          <svg
            className="star-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`grad-${i}`}>
                <stop offset="0%" stopColor={color} />
                <stop offset={`${fillPercentage}%`} stopColor={color} />
                <stop offset={`${fillPercentage}%`} stopColor={emptyColor} />
                <stop offset="100%" stopColor={emptyColor} />
              </linearGradient>
            </defs>
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={`url(#grad-${i})`}
              stroke={color}
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    
    return stars;
  };

  return (
    <div className={ratingClasses}>
      <div className="rating-stars">
        {renderStars()}
      </div>
      {showValue && (
        <span className="rating-value">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
