import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth, MOCK_FLATMATES } from '../../src/context/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { switchMockFlatmate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSelectMockFlatmate = (id: string) => {
    switchMockFlatmate(id);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>Splitzy 💸</Text>
        <Text style={styles.tagline}>Smart group expenses & instant UPI settlements</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In with Supabase</Text>
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#64748B"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64748B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.devSection}>
        <Text style={styles.devSectionTitle}>⚡ Flat 402 Quick Switch (Local Testing)</Text>
        <Text style={styles.devSectionSub}>
          Tap any of the 6 flatmates to test balances & payments as that user:
        </Text>

        <View style={styles.flatmatesGrid}>
          {MOCK_FLATMATES.map((mate) => (
            <TouchableOpacity
              key={mate.id}
              style={styles.flatmateChip}
              onPress={() => handleSelectMockFlatmate(mate.id)}
            >
              <Text style={styles.flatmateName}>{mate.name}</Text>
              <Text style={styles.flatmateUpi}>{mate.upi}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  content: { padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 36, fontWeight: '800', color: '#38BDF8', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#94A3B8', marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#F8FAFC', marginBottom: 16 },
  input: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 15,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#0284C7',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  errorText: { color: '#EF4444', marginBottom: 12, fontSize: 13 },
  devSection: { backgroundColor: '#131D2E', borderRadius: 16, padding: 18 },
  devSectionTitle: { fontSize: 15, fontWeight: '700', color: '#38BDF8', marginBottom: 4 },
  devSectionSub: { fontSize: 13, color: '#64748B', marginBottom: 14 },
  flatmatesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  flatmateChip: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  flatmateName: { color: '#F1F5F9', fontWeight: '600', fontSize: 13 },
  flatmateUpi: { color: '#38BDF8', fontSize: 11, marginTop: 2 },
});
