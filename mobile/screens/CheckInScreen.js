import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { checkIn, checkOut, getActiveCheckIn } from '../services/api';

export default function CheckInScreen({ route, navigation }) {
  const { location } = route.params;
  const [loading, setLoading] = useState(false);
  const [activeCheckIn, setActiveCheckIn] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    loadCurrentStatus();
    getUserCoords();
  }, []);

  const getUserCoords = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch (e) {
      // silently fail — manual check-in still works
    }
  };

  const loadCurrentStatus = async () => {
    try {
      setCheckingStatus(true);
      const data = await getActiveCheckIn(location.id);
      setActiveCheckIn(data);
    } catch (e) {
      setActiveCheckIn(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await checkIn({
        locationId: location.id,
        anonymous,
        latitude: userCoords?.latitude,
        longitude: userCoords?.longitude,
      });
      Alert.alert(
        'Check-in realizado!',
        `Bem-vindo a ${location.name}. A tua presenca foi registada.`,
        [{ text: 'OK', onPress: () => loadCurrentStatus() }]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Nao foi possivel fazer check-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeCheckIn) return;
    Alert.alert(
      'Confirmar saida',
      'Tens a certeza que queres fazer check-out?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await checkOut(activeCheckIn.id);
              setActiveCheckIn(null);
              Alert.alert('Check-out', 'Saiste com seguranca. Ate a proxima!');
            } catch (error) {
              Alert.alert('Erro', error.message || 'Nao foi possivel fazer check-out.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (checkingStatus) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E91E8C" />
        <Text style={styles.loadingText}>A verificar estado...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Location Header */}
      <View style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={28} color="#E91E8C" />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationAddr}>{location.address || location.city}</Text>
          <Text style={styles.activeCount}>
            {location.activeUsers || 0} pessoa(s) aqui agora
          </Text>
        </View>
      </View>

      {/* Status Banner */}
      {activeCheckIn ? (
        <View style={styles.statusBannerActive}>
          <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
          <Text style={styles.statusTextActive}>Estas com check-in ativo neste local</Text>
        </View>
      ) : (
        <View style={styles.statusBannerInactive}>
          <Ionicons name="radio-button-off" size={20} color="#aaa" />
          <Text style={styles.statusTextInactive}>Sem check-in ativo</Text>
        </View>
      )}

      {/* Anonymous toggle (only when not checked in) */}
      {!activeCheckIn && (
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Ionicons name="eye-off-outline" size={20} color="#ccc" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Modo anonimo</Text>
              <Text style={styles.optionSub}>O teu perfil nao ficara visivel aos outros</Text>
            </View>
          </View>
          <Switch
            value={anonymous}
            onValueChange={setAnonymous}
            trackColor={{ false: '#333', true: '#E91E8C' }}
            thumbColor={anonymous ? '#fff' : '#aaa'}
          />
        </View>
      )}

      {/* Action Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#E91E8C" style={{ marginTop: 32 }} />
      ) : activeCheckIn ? (
        <TouchableOpacity style={styles.checkOutBtn} onPress={handleCheckOut}>
          <Ionicons name="exit-outline" size={22} color="#fff" />
          <Text style={styles.btnText}>Fazer Check-out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.checkInBtn} onPress={handleCheckIn}>
          <Ionicons name="enter-outline" size={22} color="#fff" />
          <Text style={styles.btnText}>Fazer Check-in</Text>
        </TouchableOpacity>
      )}

      {/* Safety tip */}
      <View style={styles.safetyTip}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#F39C12" />
        <Text style={styles.safetyText}>
          O check-in expira automaticamente apos 4 horas por privacidade.
        </Text>
      </View>

      {/* Go to detail */}
      <TouchableOpacity
        style={styles.detailLink}
        onPress={() => navigation.navigate('SpotDetail', { locationId: location.id, location })}
      >
        <Text style={styles.detailLinkText}>Ver detalhes e comentarios do local</Text>
        <Ionicons name="chevron-forward" size={16} color="#E91E8C" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d1a',
    gap: 12,
  },
  loadingText: {
    color: '#aaa',
    fontSize: 14,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    gap: 14,
  },
  locationIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(233,30,140,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: { flex: 1 },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  locationAddr: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 4,
  },
  activeCount: {
    fontSize: 13,
    color: '#E91E8C',
    fontWeight: '600',
  },
  statusBannerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46,204,113,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  statusTextActive: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBannerInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  statusTextInactive: {
    color: '#aaa',
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: { flex: 1 },
  optionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  optionSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  checkInBtn: {
    backgroundColor: '#E91E8C',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  checkOutBtn: {
    backgroundColor: '#c0392b',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(243,156,18,0.1)',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 20,
  },
  safetyText: {
    color: '#F39C12',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  detailLinkText: {
    color: '#E91E8C',
    fontSize: 14,
    fontWeight: '600',
  },
});
