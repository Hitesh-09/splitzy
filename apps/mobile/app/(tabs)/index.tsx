import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/auth';

export default function DashboardScreen() {
  const router = useRouter();
  const { activeFlatmateName } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner */}
      <View style={styles.userBanner}>
        <View>
          <Text style={styles.welcomeText}>Logged in as</Text>
          <Text style={styles.userName}>{activeFlatmateName}</Text>
        </View>
        <TouchableOpacity style={styles.switchButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.switchButtonText}>Switch User</Text>
        </TouchableOpacity>
      </View>

      {/* Flat Summary Card */}
      <View style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>🏢 Flat 402 Squad</Text>
          <Text style={styles.memberBadge}>6 Members</Text>
        </View>
        <Text style={styles.groupSub}>Rent, Groceries, Electricity, Wi-Fi & Maid</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Flat Spend</Text>
            <Text style={styles.statValue}>₹2,199.00</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxRight]}>
            <Text style={styles.statLabel}>Your Net Position</Text>
            <Text style={[styles.statValue, styles.positiveText]}>+₹1,000.00</Text>
          </View>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#0284C7' }]}
          onPress={() => router.push('/(tabs)/expenses')}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionTitle}>Add Expense</Text>
          <Text style={styles.actionSub}>Split bills equally or custom</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#10B981' }]}
          onPress={() => router.push('/(tabs)/balances')}
        >
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionTitle}>Settle Up</Text>
          <Text style={styles.actionSub}>1-Tap UPI transfers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#8B5CF6' }]}
          onPress={() => router.push('/(tabs)/ai-assistant')}
        >
          <Text style={styles.actionIcon}>✨</Text>
          <Text style={styles.actionTitle}>AI Assistant</Text>
          <Text style={styles.actionSub}>Scan bills or speak text</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Flat Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.expenseItem}>
          <View style={styles.expenseIconBox}>
            <Text style={styles.expenseEmoji}>🛒</Text>
          </View>
          <View style={styles.expenseDetails}>
            <Text style={styles.expenseDesc}>Blinkit weekly groceries & snacks</Text>
            <Text style={styles.expenseMeta}>Paid by Hitesh • 6 flatmates</Text>
          </View>
          <View style={styles.expenseAmountBox}>
            <Text style={styles.expenseTotal}>₹1,200.00</Text>
            <Text style={styles.expenseShare}>Your share ₹200.00</Text>
          </View>
        </View>

        <View style={styles.expenseItem}>
          <View style={styles.expenseIconBox}>
            <Text style={styles.expenseEmoji}>📶</Text>
          </View>
          <View style={styles.expenseDetails}>
            <Text style={styles.expenseDesc}>Airtel Xstream Fiber Broadband</Text>
            <Text style={styles.expenseMeta}>Paid by Aarav • 6 flatmates</Text>
          </View>
          <View style={styles.expenseAmountBox}>
            <Text style={styles.expenseTotal}>₹999.00</Text>
            <Text style={styles.expenseShare}>Your share ₹166.50</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  content: { padding: 20 },
  userBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
  },
  welcomeText: { color: '#94A3B8', fontSize: 12 },
  userName: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  switchButton: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  switchButtonText: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },
  groupCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderColor: '#334155',
    borderWidth: 1,
  },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupName: { fontSize: 20, fontWeight: '800', color: '#F8FAFC' },
  memberBadge: {
    backgroundColor: '#0369A1',
    color: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  groupSub: { color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', borderTopColor: '#334155', borderTopWidth: 1, paddingTop: 16 },
  statBox: { flex: 1 },
  statBoxRight: { borderLeftColor: '#334155', borderLeftWidth: 1, paddingLeft: 16 },
  statLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#F8FAFC' },
  positiveText: { color: '#10B981' },
  actionsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
  },
  actionIcon: { fontSize: 20, marginBottom: 6 },
  actionTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  actionSub: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  section: { backgroundColor: '#1E293B', borderRadius: 16, padding: 18, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  sectionLink: { color: '#38BDF8', fontSize: 13, fontWeight: '600' },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
  },
  expenseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseEmoji: { fontSize: 20 },
  expenseDetails: { flex: 1 },
  expenseDesc: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  expenseMeta: { color: '#64748B', fontSize: 11, marginTop: 2 },
  expenseAmountBox: { alignItems: 'flex-end' },
  expenseTotal: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  expenseShare: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
});
