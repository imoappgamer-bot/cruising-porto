import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { updateUserProfile } from '../services/api';

/**
 * Ecrã de onboarding legal.
 * Apresentado na primeira vez que o utilizador entra na app.
 * Grava versões dos termos aceites e consentimentos de privacidade.
 */
export default function OnboardingLegal({ navigation }) {
  const [locationConsent, setLocationConsent] = useState(false);
  const [proximityConsent, setProximityConsent] = useState(false);
  const [behavioralPushConsent, setBehavioralPushConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const TERMS_VERSION = '1.0';
  const PRIVACY_VERSION = '1.0';

  async function handleAcceptAll() {
    setLoading(true);
    try {
      await updateUserProfile({
        acceptedTermsVersion: TERMS_VERSION,
        acceptedPrivacyVersion: PRIVACY_VERSION,
        locationConsent: true,
        proximityConsent: true,
        behavioralPushConsent: true,
      });
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível guardar as tuas preferências. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptSelected() {
    setLoading(true);
    try {
      await updateUserProfile({
        acceptedTermsVersion: TERMS_VERSION,
        acceptedPrivacyVersion: PRIVACY_VERSION,
        locationConsent,
        proximityConsent,
        behavioralPushConsent,
      });
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível guardar as tuas preferências. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Termos & Privacidade</Text>
      <Text style={styles.subtitle}>
        Antes de começares, lembra-te que esta é uma plataforma para adultos. Ao continuares,
        aceitas os nossos{' '}
        <Text style={styles.link}>Termos de Serviço</Text> e a nossa{' '}
        <Text style={styles.link}>Política de Privacidade</Text>.
      </Text>

      <View style={styles.consentSection}>
        <Text style={styles.sectionTitle}>Consentimentos (opcionais)</Text>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Localização precisa</Text>
            <Text style={styles.rowDesc}>Usado para mostrar locais e utilizadores próximos.</Text>
          </View>
          <Switch value={locationConsent} onValueChange={setLocationConsent} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Proximidade</Text>
            <Text style={styles.rowDesc}>Permite funcionalidades de radar e alcance.</Text>
          </View>
          <Switch value={proximityConsent} onValueChange={setProximityConsent} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Notificações personalizadas</Text>
            <Text style={styles.rowDesc}>Alertas e sugestões com base na tua atividade.</Text>
          </View>
          <Switch value={behavioralPushConsent} onValueChange={setBehavioralPushConsent} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleAcceptAll}>
            <Text style={styles.btnPrimaryText}>Aceitar tudo e continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleAcceptSelected}>
            <Text style={styles.btnSecondaryText}>Continuar com seleção</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 24, lineHeight: 22 },
  link: { color: '#007AFF', textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  consentSection: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  rowText: { flex: 1, marginRight: 12 },
  rowTitle: { fontSize: 14, fontWeight: '600' },
  rowDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  buttons: { gap: 12 },
  btnPrimary: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnSecondary: { borderWidth: 1, borderColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center' },
  btnSecondaryText: { color: '#007AFF', fontWeight: '600', fontSize: 16 },
});
