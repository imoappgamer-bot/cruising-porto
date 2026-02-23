import React from 'react';
import './LocationCard.css';

/**
 * LocationCard Component
 * Exibe um card com informações resumidas de um local de cruising
 * 
 * Props:
 * - location: objeto com dados do local (name, distance, rating, safetyRating, activeUsers, etc.)
 * - onCheckIn: função callback para realizar check-in no local
 * - onClick: função callback para navegar para detalhes do local
 */
const LocationCard = ({ location, onCheckIn, onClick }) => {
  // Arredondar distância para 1 casa decimal
  const distance = location.distance 
    ? Math.round(location.distance * 10) / 10 
    : 'N/A';

  // Garantir que rating está entre 0-5
  const rating = Math.min(Math.max(location.rating || 0, 0), 5);
  
  // Garantir que safetyRating está entre 0-10
  const safetyRating = Math.min(Math.max(location.safetyRating || 0, 0), 10);

  // Determinar cor do safety rating
  const getSafetyColor = (rating) => {
    if (rating >= 8) return 'safety-high';
    if (rating >= 5) return 'safety-medium';
    return 'safety-low';
  };

  // Handler para check-in com prevenção de propagação
  const handleCheckIn = (e) => {
    e.stopPropagation();
    if (onCheckIn) {
      onCheckIn(location.id);
    }
  };

  // Handler para click no card
  const handleCardClick = () => {
    if (onClick) {
      onClick(location.id);
    }
  };

  return (
    <div className="location-card" onClick={handleCardClick}>
      <div className="location-card-header">
        <h3 className="location-name">{location.name}</h3>
        <span className="location-type">{location.type || 'Local'}</span>
      </div>

      <div className="location-info">
        {location.description && (
          <p className="location-description">
            {location.description.length > 80 
              ? `${location.description.substring(0, 80)}...` 
              : location.description}
          </p>
        )}

        <div className="location-stats">
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <span className="stat-value">{distance} km</span>
            <span className="stat-label">distância</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{rating.toFixed(1)}</span>
            <span className="stat-label">avaliação</span>
          </div>

          <div className={`stat-item ${getSafetyColor(safetyRating)}`}>
            <span className="stat-icon">🛡️</span>
            <span className="stat-value">{safetyRating}/10</span>
            <span className="stat-label">segurança</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{location.activeUsers || 0}</span>
            <span className="stat-label">online agora</span>
          </div>
        </div>
      </div>

      <div className="location-card-footer">
        <button 
          className="btn-check-in" 
          onClick={handleCheckIn}
          aria-label={`Fazer check-in em ${location.name}`}
        >
          <span className="btn-icon">📍</span>
          Check-in
        </button>
        
        <button 
          className="btn-details"
          onClick={handleCardClick}
          aria-label={`Ver detalhes de ${location.name}`}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
