import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map({ user }) {
  const [locations, setLocations] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/locations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (locationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/api/checkins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location_id: locationId })
      });
      alert('Check-in realizado com sucesso!');
      fetchLocations();
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
      alert('Erro ao fazer check-in');
    }
  };

  if (loading) {
    return <div className="loading">Carregando mapa...</div>;
  }

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>🗺️ Mapa de Locais - Porto</h1>
        <p>Descubra e explore pontos de encontro na região do Porto</p>
      </div>

      <div className="map-container-wrapper">
        <MapContainer 
          center={[41.1579, -8.6291]} 
          zoom={13} 
          className="map-leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <Marker 
              key={location.id} 
              position={[location.latitude, location.longitude]}
              eventHandlers={{
                click: () => setSelectedLocation(location)
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                  <div className="popup-stats">
                    <span>⭐ {location.average_rating || 'N/A'}</span>
                    <span>👥 {location.checkin_count || 0} check-ins</span>
                  </div>
                  <button 
                    className="checkin-btn"
                    onClick={() => handleCheckIn(location.id)}
                  >
                    📍 Fazer Check-in
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="location-details">
          <div className="details-header">
            <h2>{selectedLocation.name}</h2>
            <button onClick={() => setSelectedLocation(null)}>✖</button>
          </div>
          <p className="details-description">{selectedLocation.description}</p>
          <div className="details-stats">
            <div className="stat">
              <span className="stat-label">Avaliação</span>
              <span className="stat-value">⭐ {selectedLocation.average_rating || 'N/A'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Check-ins</span>
              <span className="stat-value">👥 {selectedLocation.checkin_count || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Comentários</span>
              <span className="stat-value">💬 {selectedLocation.comment_count || 0}</span>
            </div>
          </div>
          <button 
            className="view-details-btn"
            onClick={() => window.location.href = `/location/${selectedLocation.id}`}
          >
            Ver Detalhes Completos
          </button>
        </div>
      )}
    </div>
  );
}

export default Map;
