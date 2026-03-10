import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getNearbyUsers } from '../services/api';

const ROLE_LABELS = {
  top: 'Top',
  bottom: 'Bottom',
  versatile: 'Versatil',
  curious: 'Curioso',
};

const DISTANCE_LABELS = (km) => {
  if (km < 0.1) return 'Muito perto';
  if (km < 0.5) return `${Math.round(km * 1000)}m`;
  return `${parseFloat(km).toFixed(1)}km`;
};

function UserCard({ user, onMessage, onProfile }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onProfile(user)} activeOpacity={0.8}>
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={26} color="#E91E8C" />
          </View>
        )}
        <View style={[styles.onlineDot, user.isOnline && styles.onlineDotActive]} />
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.cardRow}>
          <Text style={styles.username}>{user.username || 'Utilizador'}</Text>
          {user.age && <Text style={styles.age}>{user.age} anos</Text>}
        </View>
        {user.role && (
          <Text style={styles.role}>{ROLE_LABELS[user.role] || user.role}</Text>
        )}
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={12} color="#E91E8C" />
          <Text style={styles.distance}>
            {user.distance ? DISTANCE_LABELS(user.distance) : 'Perto'}
          </Text>
          {user.checkedInLocation && (
            <>
              <Text style={styles.metaSep}>|</Text>
              <Text style={styles.metaLocation} numberOfLines={1}>
                {user.checkedInLocation}
              </Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.msgBtn}
        onPress={() => onMessage(user)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#E91E8C" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function NearbyUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [radius, setRadius] = useState(1); // km
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    initLocation();
  }, []);

  useEffect(() => {
    if (userLocation) fetchUsers();
  }, [userLocation, radius]);

  const initLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (e) {
      setLocationError(true);
      setLoading(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    if (!userLocation) return;
    try {
      setLoading(true);
      const data = await getNearbyUsers(
        userLocation.latitude,
        userLocation.longitude,
        radius
      );
      setUsers(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel carregar utilizadores proximos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userLocation, radius]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleMessage = (user) => {
    navigation.navigate('Messages', { userId: user.id, username: user.username });
  };

  const handleProfile = (user) => {
    navigation.navigate('Profile', { userId: user.id });
  };

  if (locationError) {
    return (
      <View style={styles.centered}>
        <Ionicons name="location-outline" size={48} color="#E91E8C" />
        <Text style={styles.errorTitle}>GPS necessario</Text>
        <Text style={styles.errorSub}>
          Ativa o GPS para ver quem esta perto de ti.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={initLocation}>
          <Text style={styles.retryBtnText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Radius selector */}
      <View style={styles.radiusBar}>
        <Text style={styles.radiusLabel}>Raio:</Text>
        {[0.5, 1, 2, 5].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.radiusBtn, radius === r && styles.radiusBtnActive]}
            onPress={() => setRadius(r)}
          >
            <Text style={[styles.radiusBtnText, radius === r && styles.radiusBtnTextActive]}>
              {r < 1 ? `${r * 1000}m` : `${r}km`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E91E8C" />
          <Text style={styles.loadingText}>A procurar utilizadores...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <UserCard user={item} onMessage={handleMessage} onProfile={handleProfile} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E91E8C" />
          }
          contentContainerStyle={users.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={56} color="#333" />
              <Text style={styles.emptyTitle}>Ninguem por perto</Text>
              <Text style={styles.emptySub}>
                Aumenta o raio ou tenta mais tarde.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  radiusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  radiusLabel: {
    color: '#aaa',
    fontSize: 13,
    marginRight: 4,
  },
  radiusBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2a2a4a',
  },
  radiusBtnActive: {
    backgroundColor: '#E91E8C',
  },
  radiusBtnText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  radiusBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#aaa',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySub: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2a2a4a',
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(233,30,140,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#444',
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  onlineDotActive: {
    backgroundColor: '#2ECC71',
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  age: {
    color: '#aaa',
    fontSize: 13,
  },
  role: {
    color: '#E91E8C',
    fontSize: 12,
    fontWeight: '600',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  distance: {
    color: '#aaa',
    fontSize: 12,
  },
  metaSep: {
    color: '#444',
    fontSize: 12,
  },
  metaLocation: {
    color: '#888',
    fontSize: 12,
    flex: 1,
  },
  msgBtn: {
    padding: 8,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  errorSub: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#E91E8C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
