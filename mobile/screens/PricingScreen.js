import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    label: 'Seguranca basica para todos',
    price: 0,
    color: '#1ABC9C',
    features: [
      { icon: 'map-outline', text: 'Acesso total ao mapa e locais', included: true },
      { icon: 'chatbubbles-outline', text: '5 conversas/dia', included: true },
      { icon: 'location-outline', text: '5 check-ins/dia', included: true },
      { icon: 'eye-off-outline', text: 'Check-in anonimo', included: false },
      { icon: 'shield-checkmark', text: 'Botao panico basico', included: true },
      { icon: 'people-outline', text: '2 fotos perfil', included: true },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    label: 'Anonimato confortavel + mais uso',
    price: 7.99,
    popular: true,
    color: '#E91E8C',
    features: [
      { icon: 'map-outline', text: 'Tudo do Free', included: true },
      { icon: 'chatbubbles-outline', text: '30 conversas/dia', included: true },
      { icon: 'location-outline', text: '15 check-ins/dia', included: true },
      { icon: 'eye-off-outline', text: 'Esconder de \"Pessoas perto\"', included: true },
      { icon: 'filter-outline', text: 'Filtros avancados (idade, tipo)', included: true },
      { icon: 'images-outline', text: '5 fotos perfil', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    label: 'Max privacy + poder de seguranca',
    price: 14.99,
    color: '#9B59B6',
    features: [
      { icon: 'map-outline', text: 'Tudo do Plus', included: true },
      { icon: 'chatbubbles-outline', text: '100 conversas/dia (ilimitado pratico)', included: true },
      { icon: 'location-outline', text: '50 check-ins/dia + anonimos', included: true },
      { icon: 'shield-checkmark', text: 'Botao panico avancado (notifica Guardiao)', included: true },
      { icon: 'megaphone-outline', text: 'Guardian: enviar alerta massa em local', included: true },
      { icon: 'images-outline', text: '10 fotos + janelas stealth', included: true },
    ],
  },
];

function PlanCard({ plan, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.planCard,
        isSelected && styles.planCardActive,
        plan.popular && styles.planCardPopular,
      ]}
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.8}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Mais Popular</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planLabel}>{plan.label}</Text>
        <View style={styles.priceRow}>
          {plan.price === 0 ? (
            <Text style={styles.priceFree}>Gratuito</Text>
          ) : (
            <>
              <Text style={styles.priceSymbol}>€</Text>
              <Text style={styles.priceValue}>{plan.price}</Text>
              <Text style={styles.priceUnit}>/mes</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.featuresList}>
        {plan.features.map((feature, idx) => (
          <View key={idx} style={styles.featureRow}>
            <Ionicons
              name={feature.icon}
              size={16}
              color={feature.included ? plan.color : '#444'}
            />
            <Text
              style={[
                styles.featureText,
                !feature.included && styles.featureTextDisabled,
              ]}
            >
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      {isSelected && (
        <View style={[styles.selectBadge, { backgroundColor: plan.color }]}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.selectText}>Selecionado</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function PricingScreen({ route, navigation }) {
  const currentPlan = route?.params?.currentPlan || 'free';
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const handleUpgrade = () => {
    if (selectedPlan === currentPlan) {
      Alert.alert('Info', `Ja tens o plano ${selectedPlan.toUpperCase()}.`);
      return;
    }

    const plan = PLANS.find((p) => p.id === selectedPlan);
    if (selectedPlan === 'free') {
      Alert.alert('Downgrade', 'Tens a certeza que queres voltar ao Free?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => confirmPlanChange() },
      ]);
    } else {
      Alert.alert(
        `Upgrade para ${plan.name}`,
        `Vais ser cobrado €${plan.price}/mes. Confirmar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => confirmPlanChange() },
        ]
      );
    }
  };

  const confirmPlanChange = () => {
    // TODO: chamar API /api/subscription/change
    Alert.alert('Sucesso!', `Plano alterado para ${selectedPlan.toUpperCase()}.`);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Escolhe o teu plano</Text>
        <Text style={styles.subtitle}>
          Privacidade e seguranca adaptadas as tuas necessidades
        </Text>
      </View>

      {PLANS.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan === plan.id}
          onSelect={setSelectedPlan}
        />
      ))}

      <View style={styles.inviteSection}>
        <Ionicons name="gift-outline" size={24} color="#F39C12" />
        <Text style={styles.inviteText}>
          Convida 3 amigos e ganha <Text style={styles.inviteBold}>7 dias PLUS gratis!</Text>
        </Text>
      </View>

      {selectedPlan !== currentPlan && (
        <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
          <Text style={styles.upgradeBtnText}>
            {selectedPlan === 'free' ? 'Voltar ao Free' : `Ativar ${selectedPlan.toUpperCase()}`}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
        <Text style={styles.backLinkText}>Voltar</Text>
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
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardActive: {
    borderColor: '#E91E8C',
    backgroundColor: 'rgba(233,30,140,0.08)',
  },
  planCardPopular: {
    borderColor: '#F39C12',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#F39C12',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  planLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceFree: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1ABC9C',
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E91E8C',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E91E8C',
  },
  priceUnit: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 4,
  },
  featuresList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#ddd',
  },
  featureTextDisabled: {
    color: '#555',
    textDecorationLine: 'line-through',
  },
  selectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  inviteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243,156,18,0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  inviteText: {
    flex: 1,
    fontSize: 14,
    color: '#F39C12',
    lineHeight: 20,
  },
  inviteBold: {
    fontWeight: '700',
  },
  upgradeBtn: {
    backgroundColor: '#E91E8C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  upgradeBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backLinkText: {
    color: '#888',
    fontSize: 15,
  },
});
