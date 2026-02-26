import React from 'react';
import './AlertBanner.css';

const ALERT_TYPES = {
  police: {
    icon: '🚨',
    label: 'Atividade policial',
    color: '#3498DB',
  },
  robbery: {
    icon: '⚠️',
    label: 'Roubo/Assalto',
    color: '#E74C3C',
  },
  homophobia: {
    icon: '🚫',
    label: 'Incidente homofóbico',
    color: '#9B59B6',
  },
  construction: {
    icon: '🚧',
    label: 'Obras/Acesso encerrado',
    color: '#F39C12',
  },
  generic: {
    icon: 'ℹ️',
    label: 'Aviso',
    color: '#1ABC9C',
  },
};

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  const typeConfig = ALERT_TYPES[alert.type] || ALERT_TYPES.generic;

  return (
    <div className="alert-banner" style={{ borderLeftColor: typeConfig.color }}>
      <div className="alert-icon">{typeConfig.icon}</div>
      <div className="alert-content">
        <div className="alert-header">
          <span className="alert-type">{typeConfig.label}</span>
          <span className="alert-time">{alert.time || 'Agora'}</span>
        </div>
        <p className="alert-message">{alert.message}</p>
        {alert.reporter && (
          <span className="alert-reporter">Reportado por: {alert.reporter}</span>
        )}
      </div>
      {onDismiss && (
        <button
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label="Fechar alerta"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function AlertList({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-empty">
        <span className="alert-empty-icon">✅</span>
        <p>Sem alertas ativos</p>
      </div>
    );
  }

  return (
    <div className="alert-list">
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.id}
          alert={alert}
          onDismiss={onDismiss ? () => onDismiss(alert.id) : null}
        />
      ))}
    </div>
  );
}
