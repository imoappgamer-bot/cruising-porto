import React from 'react';
import { useParams } from 'react-router-dom';
import './Location.css';

function Location({ user }) {
  const { id } = useParams();
  const [location, setLocation] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [rating, setRating] = React.useState(5);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchLocationDetails();
    fetchComments();
  }, [id]);

  const fetchLocationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/locations/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Erro ao carregar local:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/locations/${id}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/locations/${id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: newComment, rating })
      });
      setNewComment('');
      setRating(5);
      fetchComments();
      fetchLocationDetails();
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!location) {
    return <div className="error">Local não encontrado</div>;
  }

  return (
    <div className="location-page">
      <div className="location-header">
        <button onClick={() => window.history.back()} className="back-btn">← Voltar</button>
        <h1>{location.name}</h1>
        <p className="location-description">{location.description}</p>
      </div>

      <div className="location-stats">
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <span className="stat-label">Avaliação</span>
          <span className="stat-value">{location.average_rating || 'N/A'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-label">Check-ins</span>
          <span className="stat-value">{location.checkin_count || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💬</span>
          <span className="stat-label">Comentários</span>
          <span className="stat-value">{comments.length}</span>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comentários e Avaliações</h2>
        
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="rating-input">
            <label>Sua avaliação:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrela{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Compartilhe sua experiência..."
            required
          />
          <button type="submit" className="btn-primary">Enviar Comentário</button>
        </form>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <span className="comment-user">{comment.username}</span>
                <span className="comment-rating">{'⭐'.repeat(comment.rating)}</span>
              </div>
              <p className="comment-text">{comment.comment}</p>
              <span className="comment-date">{new Date(comment.created_at).toLocaleDateString('pt-PT')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Location;
