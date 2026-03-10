import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { getLocations, getNearbyLocations } from '../services/api';

const CATEGORY_COLORS = {
  park: '#2ECC71',
  sauna: '#E74C3C',
  bar: '#9B59B6',
  beach: '#3498DB',
  mall: '#F39C12',
  restroom: '#1ABC9C',
  default: '#E91E8C',
};

const PORTO_REGION = {
  latitude: 41.1579,
  longitude: -8.6291,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(PORTO_REGION);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    fetchLocations();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setUserLocation(coords);
        setRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel carregar os locais.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearby = async () => {
    if (!userLocation) {
      Alert.alert('GPS necessario', 'Ative o GPS para ver locais proximos.');
      return;
    }
    try {
      setLoading(true);
      const data = await getNearbyLocations(
        userLocation.latitude,
        userLocation.longitude,
        5
      );
      setLocations(data || []);
      setNearbyMode(true);
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel buscar locais proximos.');
    } finally {
      setLoading(false);
    }
  };

  const resetToAll = async () => {
    setNearbyMode(false);
    await fetchLocations();
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        { ...userLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 },
        600
      );
    }
  };

  const getMarkerColor = (category) =>
    CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
  };

  const goToDetail = (location) => {
    navigation.navigate('SpotDetail', { locationId: location.id, location });
  };

  const goToCheckIn = (location) => {
    navigation.navigate('CheckIn', { location });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={() => setSelectedLocation(null)}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: parseFloat(loc.latitude), longitude: parseFloat(loc.longitude) }}
            onPress={() => handleMarkerPress(loc)}
            pinColor={getMarkerColor(loc.category)}
          >
            <Callout onPress={() => goToDetail(loc)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle} numberOfLines={1}>{loc.name}</Text>
                <Text style={styles.calloutSub}>
                  {loc.activeUsers > 0 ? `${loc.activeUsers} aqui agora` : 'Sem check-ins'}
                </Text>
                {nearbyMode && loc.distance && (
                  <Text style={styles.calloutDist}>{loc.distance} km</Text>
                )}
                <Text style={styles.calloutAction}>Ver detalhes →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Top controls */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.filterBtn, nearbyMode && styles.filterBtnActive]}
          onPress={nearbyMode ? resetToAll : fetchNearby}
        >
          <Ionicons name={nearbyMode ? 'location' : 'location-outline'} size={16} color="#fff" />
          <Text style={styles.filterBtnText}>
            {nearbyMode ? 'Todos os locais' : 'Proximos a mim'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom floating buttons */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.fab} onPress={centerOnUser}>
          <Ionicons name="navigate" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={fetchLocations}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
        {selectedLocation && (
          <TouchableOpacity
            style={[styles.fab, styles.fabCheckin]}
            onPress={() => goToCheckIn(selectedLocation)}
          >
            <Ionicons name="enter-outline" size={22} color="#fff" />
            <Text style={styles.fabCheckinText}>Check-in</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#E91E8C" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 4,
  },
  calloutSub: {
    fontSize: 12,
    color: '#666',
  },
  calloutDist: {
    fontSize: 11,
    color: '#E91E8C',
    marginTop: 2,
  },
  calloutAction: {
    marginTop: 6,
    fontSize: 12,
    color: '#E91E8C',
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,30,60,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  filterBtnActive: {
    backgroundColor: '#E91E8C',
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    gap: 12,
    alignItems: 'center',
  },
  fab: {
    backgroundColor: 'rgba(30,30,60,0.85)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabCheckin: {
    backgroundColor: '#E91E8C',
    width: 'auto',
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 6,
  },
  fabCheckinText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
