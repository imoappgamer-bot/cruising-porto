import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { spotService } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    try {
      setLoading(true);
      const response = await spotService.list({ limit: 20, offset: 0 });
      setSpots(response.data.spots || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os spots');
    } finally {
      setLoading(false);
    }
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
      <Text style={styles.spotDescription}>{spot.description}</Text>
      <View style={styles.spotFooter}>
        <Text style={styles.spotLocation}>📄 {spot.location}</Text>
        <View style={styles.spotTags}>
          {spot.type && (
            <Text style={styles.spotTag}>{spot.type}</Text>
          )}
        </View>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cruising Porto</Text>
        <Text style={styles.headerSubtitle}>Descubra novos spots</Text>
      </View>

      {spots.length > 0 ? (
        <FlatList
          data={spots}
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
Nenhum spot disponível no momento</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadSpots}
          >
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
  header: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  spotLocation: {
    fontSize: 12,
    color: '#00BCD4',
    fontWeight: '500',
  },
  spotTags: {
    flexDirection: 'row',
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

export default HomeScreen;
