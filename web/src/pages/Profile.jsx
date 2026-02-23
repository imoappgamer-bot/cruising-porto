import React from 'react';
import './Profile.css';

function Profile({ user }) {
  const [stats, setStats] = React.useState(null);
  const [checkins, setCheckins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user stats
      const statsResponse = await fetch(`http://localhost:3000/api/profile/${user.id}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch user checkins
      const checkinsResponse = await fetch(`http://localhost:3000/api/profile/${user.id}/checkins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const checkinsData = await checkinsResponse.json();
      setCheckins(checkinsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando perfil...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          👤
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">Membro desde {new Date(user.created_at).toLocaleDateString('pt-PT')}</p>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <span className="stat-value">{stats.total_checkins || 0}</span>
              <span className="stat-label">Check-ins</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <span className="stat-value">{stats.total_comments || 0}</span>
              <span className="stat-label">Comentários</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-value">{stats.average_rating || 'N/A'}</span>
              <span className="stat-label">Avaliação Média</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <span className="stat-value">{stats.streak_days || 0}</span>
              <span className="stat-label">Dias Consecutivos</span>
            </div>
          </div>
        </div>
      )}

      <div className="recent-activity">
        <h2>🕒 Atividade Recente</h2>
        {checkins.length > 0 ? (
          <div className="checkins-list">
            {checkins.map((checkin) => (
              <div key={checkin.id} className="checkin-item">
                <div className="checkin-icon">📍</div>
                <div className="checkin-details">
                  <h3>{checkin.location_name}</h3>
                  <p className="checkin-time">
                    {new Date(checkin.created_at).toLocaleString('pt-PT')}
                  </p>
                  {checkin.comment && (
                    <p className="checkin-comment">{checkin.comment}</p>
                  )}
                  {checkin.rating && (
                    <div className="checkin-rating">
                      {'⭐'.repeat(checkin.rating)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-activity">
            <p>👁️ Nenhuma atividade recente</p>
            <p>Faça seu primeiro check-in no mapa!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
