import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useAuth } from '../../src/context/auth';

interface DebtItem {
  id: string;
  from: string;
  to: string;
  amount: number;
  upi: string;
}

const DEMO_SIMPLIFIED_DEBTS: DebtItem[] = [
  { id: '1', from: 'Rohan Verma', to: 'Hitesh Shimpi', amount: 366.50, upi: 'hitesh@okhdfcbank' },
  { id: '2', from: 'Kabir Mehta', to: 'Hitesh Shimpi', amount: 366.50, upi: 'hitesh@okhdfcbank' },
  { id: '3', from: 'Dev Patel', to: 'Hitesh Shimpi', amount: 267.00, upi: 'hitesh@okhdfcbank' },
  { id: '4', from: 'Siddharth Rao', to: 'Aarav Sharma', amount: 366.50, upi: 'aarav@okaxis' },
];

export default function BalancesScreen() {
  const { activeFlatmateName } = useAuth();
  const [debts, setDebts] = useState<DebtItem[]>(DEMO_SIMPLIFIED_DEBTS);
  const [settledIds, setSettledIds] = useState<string[]>([]);

  const handlePayUPI = async (debt: DebtItem) => {
    const upiUri = `upi://pay?pa=${encodeURIComponent(debt.upi)}&pn=${encodeURIComponent(debt.to)}&am=${debt.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Splitzy Flat Settlement')}`;
    
    try {
      const canOpen = await Linking.canOpenURL(upiUri);
      if (canOpen) {
        await Linking.openURL(upiUri);
        Alert.alert(
          'UPI App Launched',
          `Opened UPI app to pay ₹${debt.amount.toFixed(2)} to ${debt.to}.\n\nOnce the transfer succeeds, confirm below to record the settlement.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Record as Paid',
              onPress: () => {
                setSettledIds((prev) => [...prev, debt.id]);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'No UPI App Found',
          `Cannot launch direct UPI intent. Pay manually to:\n\nVPA: ${debt.upi}\nAmount: ₹${debt.amount.toFixed(2)}`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Mark as Paid',
              onPress: () => setSettledIds((prev) => [...prev, debt.id]),
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to launch UPI application');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Simplified Flat Settlements</Text>
        <Text style={styles.subtitle}>
          Minimum peer-to-peer transfers required to clear all flat balances:
        </Text>
      </View>

      <View style={styles.debtList}>
        {debts.map((debt) => {
          const isSettled = settledIds.includes(debt.id);
          return (
            <View key={debt.id} style={[styles.debtCard, isSettled && styles.debtCardSettled]}>
              <View style={styles.debtHeader}>
                <View style={styles.participantCol}>
                  <Text style={styles.fromName}>{debt.from}</Text>
                  <Text style={styles.debtDirection}>pays ➔</Text>
                  <Text style={styles.toName}>{debt.to}</Text>
                </View>
                <View style={styles.amountCol}>
                  <Text style={styles.amountValue}>₹{debt.amount.toFixed(2)}</Text>
                  <Text style={styles.upiId}>{debt.upi}</Text>
                </View>
              </View>

              {isSettled ? (
                <View style={styles.settledBadge}>
                  <Text style={styles.settledText}>✓ Settlement Recorded (Pending Reconciliation)</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handlePayUPI(debt)}
                >
                  <Text style={styles.payButtonText}>⚡ Pay via UPI (GPay / PhonePe / Paytm)</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  content: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  debtList: { gap: 14 },
  debtCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  debtCardSettled: {
    borderColor: '#10B981',
    backgroundColor: '#0F1F1E',
  },
  debtHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  participantCol: { flex: 1 },
  fromName: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  debtDirection: { fontSize: 12, color: '#64748B', marginVertical: 2 },
  toName: { fontSize: 15, fontWeight: '700', color: '#38BDF8' },
  amountCol: { alignItems: 'flex-end' },
  amountValue: { fontSize: 18, fontWeight: '800', color: '#F8FAFC' },
  upiId: { fontSize: 11, color: '#64748B', marginTop: 2 },
  payButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  payButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  settledBadge: {
    backgroundColor: '#064E3B',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  settledText: { color: '#34D399', fontWeight: '600', fontSize: 12 },
});
