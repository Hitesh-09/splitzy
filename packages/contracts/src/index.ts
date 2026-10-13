// ==============================================================================
// Splitzy Domain Contracts & TypeScript Types
// ==============================================================================

export type Currency = 'INR' | string;

export type MemberRole = 'owner' | 'admin' | 'member';
export type MemberStatus = 'invited' | 'active' | 'left';

export type ExpenseCategory =
  | 'rent'
  | 'groceries'
  | 'electricity'
  | 'wifi'
  | 'maid'
  | 'water'
  | 'food'
  | 'travel'
  | 'miscellaneous';

export type SplitType = 'equal' | 'exact' | 'percentage' | 'shares';

export type SettlementStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type PaymentProvider = 'upi_intent' | 'razorpay' | 'cashfree' | 'manual';
export type PaymentAttemptStatus = 'created' | 'pending' | 'succeeded' | 'failed' | 'expired';

// ------------------------------------------------------------------------------
// Core Entities
// ------------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  upiVpa?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  members?: GroupMemberSummary[];
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  profile?: UserProfile;
}

export interface GroupMemberSummary {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  upiVpa?: string | null;
  role: MemberRole;
  status: MemberStatus;
}

export interface ExpenseSplit {
  expenseId: string;
  groupId: string;
  userId: string;
  sharePaise: number; // Integer paise
}

export interface Expense {
  id: string;
  groupId: string;
  paidBy: string;
  createdBy: string;
  description: string;
  category: ExpenseCategory;
  amountPaise: number; // Integer paise
  splitType: SplitType;
  receiptUrl?: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  splits: ExpenseSplit[];
  payer?: UserProfile;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUser: string;
  toUser: string;
  amountPaise: number; // Integer paise
  status: SettlementStatus;
  notes?: string | null;
  createdAt: string;
  completedAt?: string | null;
  fromProfile?: UserProfile;
  toProfile?: UserProfile;
}

export interface PaymentAttempt {
  id: string;
  settlementId: string;
  provider: PaymentProvider;
  providerPaymentId?: string | null;
  status: PaymentAttemptStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// Financial & Balance Aggregates
// ------------------------------------------------------------------------------

export interface MemberBalance {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  upiVpa?: string | null;
  totalPaidPaise: number;
  totalSharePaise: number;
  netBalancePaise: number; // Positive = gets back, Negative = owes
}

export interface SimplifiedDebtTransfer {
  fromUser: string;
  fromName: string;
  toUser: string;
  toName: string;
  toUpiVpa?: string | null;
  amountPaise: number;
}

export interface GroupBalancesResponse {
  groupId: string;
  totalGroupSpendPaise: number;
  memberBalances: MemberBalance[];
  simplifiedDebts: SimplifiedDebtTransfer[];
}

// ------------------------------------------------------------------------------
// UPI Intent Payload
// ------------------------------------------------------------------------------

export interface UpiIntentParams {
  pa: string; // Payee VPA / UPI ID
  pn: string; // Payee Name
  am: string; // Amount in Rupees with 2 decimal places (e.g. "120.00")
  cu: 'INR';  // Currency
  tn: string; // Transaction Note
}

// ------------------------------------------------------------------------------
// AI Assistant Schemas
// ------------------------------------------------------------------------------

export interface AiExpenseDraft {
  description: string;
  category: ExpenseCategory;
  amountPaise: number;
  payerNameOrId?: string;
  splitType: SplitType;
  participantNamesOrIds: string[];
  exactShares?: Record<string, number>;
  confidence: number;
  notes?: string;
}

export interface AiQueryResponse {
  answer: string;
  supportingData?: Record<string, unknown>;
}
