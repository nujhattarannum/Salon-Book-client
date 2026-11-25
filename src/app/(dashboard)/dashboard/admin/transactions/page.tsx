"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import { TransactionRecord } from "@/types/salon";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const data = await apiRequest<
          { transactions?: TransactionRecord[] } | TransactionRecord[]
        >("/admin/transactions");
        setTransactions(Array.isArray(data) ? data : data.transactions || []);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load transactions."
        );
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.status === "paid" || t.status === "succeeded")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Total Collected Revenue
          </p>
          <p className="mt-2 font-editorial text-3xl text-[#C87D6B]">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <span className="text-xs text-neutral-400">
          {transactions.length} records
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-[#FAF8F5] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-5 py-3.5">Transaction ID</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Service</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-neutral-400">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-neutral-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-neutral-50/70">
                  <td className="px-5 py-4 font-mono text-xs text-neutral-600">
                    {tx.transactionId || tx._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-neutral-700">
                    {tx.customerName || tx.customerEmail || "Customer"}
                  </td>
                  <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                    {tx.serviceName || "Salon Service"}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    ${Number(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={tx.status} />
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}