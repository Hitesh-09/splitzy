import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const CATEGORIES = ['All', 'Groceries', 'Wi-Fi', 'Electricity', 'Rent', 'Maid', 'Water', 'Miscellaneous'];

export default function ExpensesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Expenses History</Text>
        <TouchableOpacity style={styles.newButton}>
          <Text style={styles.newButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterPill, selectedCategory === cat && styles.filterPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.filterPillText, selectedCategory === cat && styles.filterPillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expense List */}
      <View style={styles.listCard}>
        <View style={styles.expenseItem}>
          <View style={styles.badgeBox}>
            <Text style={styles.badgeEmoji}>🛒</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.expenseTitle}>Blinkit weekly groceries & snacks</Text>
            <Text style={styles.expenseSub}>Paid by Hitesh Shimpi • Today</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.amountTotal}>₹1,200.00</Text>
            <Text style={styles.amountSplit}>Split 6 ways (₹200.00 ea)</Text>
          </View>
        </View>

        <View style={styles.expenseItem}>
          <View style={styles.badgeBox}>
            <Text style={styles.badgeEmoji}>📶</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.expenseTitle}>Airtel Fiber 200Mbps Monthly Bill</Text>
            <Text style={styles.expenseSub}>Paid by Aarav Sharma • Yesterday</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.amountTotal}>₹999.00</Text>
            <Text style={styles.amountSplit}>Split 6 ways (₹166.50 ea)</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },
  newButton: { backgroundColor: '#0284C7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  newButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  filterBar: { flexDirection: 'row', marginBottom: 20 },
  filterPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPillActive: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  filterPillText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  filterPillTextActive: { color: '#FFFFFF' },
  listCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16 },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
  },
  badgeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeEmoji: { fontSize: 22 },
  infoCol: { flex: 1 },
  expenseTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  expenseSub: { color: '#64748B', fontSize: 12, marginTop: 3 },
  amountCol: { alignItems: 'flex-end' },
  amountTotal: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  amountSplit: { color: '#38BDF8', fontSize: 11, marginTop: 3 },
});
