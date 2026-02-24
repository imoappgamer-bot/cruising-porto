import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { spotService } from '../services/api';

const SpotsScreen = ({ navigation }) => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState([]);

  useEffect(() => {
    loadSpots();
  }, []);

  useEffect(() => {
    filterSpots();
  }, [searchQuery, spots]);

  const loadSpots = async () => {
    try {
      setLoading(true);
      const response = await spotService.list({ limit: 50, offset: 0 });
      setSpots(response.data.spots || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os spots');
    } finally {
      setLoading(false);
    }
  };

  const filterSpots = () => {
    if (!searchQuery.trim()) {
      setFilteredSpots(spots);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = spots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(query) ||
        spot.location.toLowerCase().includes(query) ||
        spot.description.toLowerCase().includes(query)
    );
    setFilteredSpots(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSpots();
    setRefreshing(false);
  };

  const handleSpotPress = (spot) => {
    navigation.navigate('SpotDetail', { spotId: spot.id });
  };

  const SpotCard = ({ spot }) => (
    <TouchableOpacity
      style={styles.spotCard}
      onPress={() => handleSpotPress(spot)}
    >
      <View style={styles.spotCardHeader}>
        <Text style={styles.spotName}>{spot.name}</Text>
        <Text style={styles.spotRating}>★ {spot.rating || 'N/A'}</Text>
      </View>
      <Text style={styles.spotLocation}>📐 {spot.location}</Text>
      <Text style={styles.spotDescription}>{spot.description}</Text>
      <View style={styles.spotFooter}>
        {spot.type && <Text style={styles.spotTag}>{spot.type}</Text>}
        <Text style={styles.visitText}>{spot.visits} visitas</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procure spots..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredSpots.length > 0 ? (
        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SpotCard spot={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {spots.length === 0
              ? 'Nenhum spot disponível'
              : 'Nenhum resultado encontrado'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSpots}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  spotCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  spotRating: {
    fontSize: 16,
    color: '#FFB800',
    fontWeight: '600',
  },
  spotLocation: {
    fontSize: 12,
    color: '#00BCD4',
    fontWeight: '500',
    marginBottom: 8,
  },
  spotDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  spotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotTag: {
    backgroundColor: '#E0F2F1',
    color: '#00897B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  visitText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpotsScreen;
