import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../src/context/auth';

interface DraftExpense {
  description: string;
  category: string;
  amount: number;
  payer: string;
  splitWith: string;
  sharePerPerson: number;
}

export default function AiAssistantScreen() {
  const { activeFlatmateName } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [draft, setDraft] = useState<DraftExpense | null>(null);

  const handleGenerateDraft = () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Input', 'Please type or speak an expense description first.');
      return;
    }

    setIsProcessing(true);

    // Mock AI extraction response matching Phase 1 foundation
    setTimeout(() => {
      setIsProcessing(false);
      setDraft({
        description: inputText,
        category: 'Groceries',
        amount: 1850.00,
        payer: activeFlatmateName,
        splitWith: 'All 6 flatmates (Equal split)',
        sharePerPerson: 308.33,
      });
    }, 800);
  };

  const handleConfirmDraft = () => {
    Alert.alert('Expense Created', `Saved ₹${draft?.amount.toFixed(2)} for "${draft?.description}".\nSplit across 6 members.`);
    setDraft(null);
    setInputText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Splitzy AI Assistant ✨</Text>
        <Text style={styles.subtitle}>
          Natural language expense entry & flat spending insights
        </Text>
      </View>

      {/* Input Box */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Enter expense details in plain English:</Text>
        <TextInput
          style={styles.textInput}
          placeholder='e.g. "I paid ₹1,850 for groceries for everyone" or "Paid 450 for Wi-Fi split with Rohan and Kabir"'
          placeholderTextColor="#64748B"
          multiline
          numberOfLines={3}
          value={inputText}
          onChangeText={setInputText}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateDraft}
            disabled={isProcessing}
          >
            <Text style={styles.generateButtonText}>
              {isProcessing ? 'Analyzing with Gemini...' : '✨ Generate Expense Draft'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Extracted Draft Card */}
      {draft && (
        <View style={styles.draftCard}>
          <View style={styles.draftBadge}>
            <Text style={styles.draftBadgeText}>AI DRAFT • REQUIRES CONFIRMATION</Text>
          </View>
          <Text style={styles.draftTitle}>{draft.description}</Text>

          <View style={styles.draftDetails}>
            <View style={styles.draftRow}>
              <Text style={styles.draftLabel}>Total Amount:</Text>
              <Text style={styles.draftValue}>₹{draft.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.draftRow}>
              <Text style={styles.draftLabel}>Category:</Text>
              <Text style={styles.draftValue}>{draft.category}</Text>
            </View>
            <View style={styles.draftRow}>
              <Text style={styles.draftLabel}>Paid By:</Text>
              <Text style={styles.draftValue}>{draft.payer}</Text>
            </View>
            <View style={styles.draftRow}>
              <Text style={styles.draftLabel}>Splitting With:</Text>
              <Text style={styles.draftValue}>{draft.splitWith}</Text>
            </View>
            <View style={styles.draftRow}>
              <Text style={styles.draftLabel}>Per Member Share:</Text>
              <Text style={[styles.draftValue, { color: '#38BDF8' }]}>₹{draft.sharePerPerson.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setDraft(null)}>
              <Text style={styles.cancelButtonText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDraft}>
              <Text style={styles.confirmButtonText}>✓ Confirm & Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Prompts */}
      <View style={styles.promptsSection}>
        <Text style={styles.promptsTitle}>💡 Try asking questions:</Text>
        <TouchableOpacity
          style={styles.promptChip}
          onPress={() => setInputText('Who owes me money this month?')}
        >
          <Text style={styles.promptChipText}>"Who owes me money this month?"</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.promptChip}
          onPress={() => setInputText('How much did the flat spend on groceries?')}
        >
          <Text style={styles.promptChipText}>"How much did the flat spend on groceries?"</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.promptChip}
          onPress={() => setInputText('I paid 600 for water cans for everyone')}
        >
          <Text style={styles.promptChipText}>"I paid ₹600 for water cans for everyone"</Text>
        </TouchableOpacity>
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
  inputCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  inputLabel: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', marginBottom: 10 },
  textInput: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 14,
  },
  buttonRow: { alignItems: 'flex-end' },
  generateButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  generateButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  draftCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginBottom: 20,
  },
  draftBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  draftBadgeText: { color: '#C4B5FD', fontSize: 11, fontWeight: '700' },
  draftTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  draftDetails: { gap: 8, marginBottom: 16, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 12 },
  draftRow: { flexDirection: 'row', justifyContent: 'space-between' },
  draftLabel: { color: '#94A3B8', fontSize: 13 },
  draftValue: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 10 },
  cancelButton: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#94A3B8', fontWeight: '600', fontSize: 14 },
  confirmButton: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  promptsSection: { backgroundColor: '#1E293B', borderRadius: 16, padding: 18 },
  promptsTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 12 },
  promptChip: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  promptChipText: { color: '#38BDF8', fontSize: 13 },
});
