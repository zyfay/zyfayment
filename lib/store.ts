// lib/store.ts
// Simple in-memory store - ganti dengan database (PostgreSQL/MySQL/MongoDB) untuk production

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  description: string;
  status: "pending" | "paid" | "expired" | "failed";
  qrisString: string;
  qrisImage?: string;
  createdAt: string;
  expiredAt: string;
  paidAt?: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}

// Global store (reset saat server restart — pakai DB untuk production)
declare global {
  // eslint-disable-next-line no-var
  var __transactions: Map<string, Transaction> | undefined;
}

if (!global.__transactions) {
  global.__transactions = new Map();
}

export const transactions = global.__transactions;

export function createTransaction(data: Omit<Transaction, "id" | "createdAt" | "expiredAt" | "status">): Transaction {
  const id = `ZY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const now = new Date();
  const expired = new Date(now.getTime() + 30 * 60 * 1000); // 30 menit

  const trx: Transaction = {
    ...data,
    id,
    status: "pending",
    createdAt: now.toISOString(),
    expiredAt: expired.toISOString(),
  };

  transactions.set(id, trx);
  return trx;
}

export function getTransaction(id: string): Transaction | undefined {
  return transactions.get(id);
}

export function updateTransaction(id: string, update: Partial<Transaction>): Transaction | null {
  const trx = transactions.get(id);
  if (!trx) return null;
  const updated = { ...trx, ...update };
  transactions.set(id, updated);
  return updated;
}

export function getAllTransactions(): Transaction[] {
  return Array.from(transactions.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
