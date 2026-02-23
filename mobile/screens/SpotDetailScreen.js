import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { spotService, favoriteService } from '../services/api';

const SpotDetailScreen = ({ route, navigation }) => {
  const { spotId } = route.params;
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    loadSpotDetails();
  }, [spotId]);

  const loadSpotDetails = async () => {
    try {
      setLoading(true);
      const response = await spotService.getDetail(spotId);
      setSpot(response.data.spot);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do spot');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoriteService.remove(spotId);
        setIsFavorite(false);
        Alert.alert('Sucesso', 'Removido dos favoritos');
      } else {
        await favoriteService.add(spotId);
        setIsFavorite(true);
        Alert.alert('Sucesso', 'Adicionado aos favoritos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar favoritos');
    }
  };

  const handleRate = async (selectedRating) => {
    try {
      await spotService.rate(spotId, selectedRating);
      setRating(selectedRating);
      Alert.alert('Sucesso', 'Avaliação enviada!');
      // Recarregar detalhes para atualizar rating médio
      await loadSpotDetails();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar avaliação');
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Reportar Spot',
      'Escolha o motivo do report:',
      [
        {
          text: 'Inseguro',
          onPress: () => submitReport('inseguro'),
        },
        {
          text: 'Fechado',
          onPress: () => submitReport('fechado'),
        },
        {
          text: 'Lixo/Sujeira',
          onPress: () => submitReport('lixo'),
        },
        {
          text: 'Outro',
          onPress: () => submitReport('outro'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const submitReport = async (reason) => {
    try {
      await spotService.report(spotId, reason);
      Alert.alert('Sucesso', 'Report enviado. Obrigado pelo feedback!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o report');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Spot não encontrado</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.spotName}>{spot.name}</Text>
            <Text style={styles.spotLocation}>📍 {spot.location}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavorite}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>★ {spot.rating || 'N/A'}</Text>
          <Text style={styles.visitsText}>{spot.visits} visitas</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.description}>{spot.fullDescription || spot.description}</Text>
        </View>

        {spot.amenities && spot.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comodidades</Text>
            <View style={styles.amenitiesList}>
              {spot.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Text style={styles.amenityText}>• {amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {spot.bestTimes && spot.bestTimes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Melhores Horários</Text>
            <View style={styles.timesList}>
              {spot.bestTimes.map((time, index) => (
                <View key={index} style={styles.timeChip}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avalie este Spot</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRate(star)}
              >
                <Text style={styles.starButton}>
                  {star <= rating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={handleReport}
          >
            <Text style={styles.reportButtonText}>⚠️ Reportar Problema</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
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
  header: {
    backgroundColor: '#00BCD4',
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  spotName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  spotLocation: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 32,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  visitsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    paddingVertical: 4,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
  },
  timesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 13,
    color: '#00897B',
    fontWeight: '500',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    fontSize: 36,
    color: '#FFB800',
  },
  actionsContainer: {
    marginTop: 8,
  },
  reportButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  reportButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SpotDetailScreen;
