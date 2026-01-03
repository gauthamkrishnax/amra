"use client";

import { useState, useEffect } from "react";
import { getExpensesData, deleteExpense } from "@/app/_lib/firestore/expense";
import Link from "next/link";

const CATEGORY_INFO = {
  food: { label: "Food", icon: "🍔" },
  bill: { label: "Bill", icon: "📄" },
  grocery: { label: "Grocery", icon: "🛒" },
  entertainment: { label: "Entertainment", icon: "🎬" },
  miscellaneous: { label: "Miscellaneous", icon: "📦" },
};

export default function ExpensesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const result = await getExpensesData();
      setData(result);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(expenseId) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    setDeleting(expenseId);
    setError(null);

    try {
      await deleteExpense(expenseId);
      setData((prev) => ({
        ...prev,
        expenses: prev.expenses.filter((e) => e.id !== expenseId),
      }));
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center">
          <p className="text-slate-400">
            Unable to load expenses. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Calculate monthly spend (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = data.expenses.filter((e) => {
    const expenseDate = new Date(e.createdAt);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate who owes who
  const currentUserPaid = monthlyExpenses
    .filter((e) => e.paidBy === data.currentUser.id)
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerPaid = monthlyExpenses
    .filter((e) => e.paidBy === data.partner.id)
    .reduce((sum, e) => sum + e.amount, 0);

  const fairShare = monthlyTotal / 2;
  const currentUserOwes = fairShare - currentUserPaid;
  const partnerOwes = fairShare - partnerPaid;

  // Determine who owes who
  let oweText = "";
  let oweAmount = 0;
  if (currentUserOwes > 0) {
    oweText = `${data.currentUser.nickname} owes ${data.partner.nickname}`;
    oweAmount = currentUserOwes;
  } else if (partnerOwes > 0) {
    oweText = `${data.partner.nickname} owes ${data.currentUser.nickname}`;
    oweAmount = partnerOwes;
  }

  const getNickname = (userId) => {
    if (userId === data.currentUser.id) return data.currentUser.nickname;
    if (userId === data.partner.id) return data.partner.nickname;
    return "Unknown";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
            Expenses
          </h1>
        </div>

        {/* Monthly Summary Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 mb-4">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">
              {now.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-4xl font-bold text-white">
              ${monthlyTotal.toFixed(2)}
            </p>
            <p className="text-slate-500 text-xs mt-1">total spent</p>
          </div>

          {/* Who Owes Who */}
          {oweAmount > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">{oweText}</span>
                <span className="text-lg font-bold text-amber-400">
                  ${oweAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {oweAmount === 0 && monthlyTotal > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <span className="text-emerald-400 text-sm">
                ✓ All settled up!
              </span>
            </div>
          )}
        </div>

        {/* Add Expense Button */}
        <Link
          href="/expenses/add"
          className="block w-full py-3 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 text-center mb-4"
        >
          + Add Expense
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-slate-300">
              All Expenses
            </h2>
          </div>

          {data.expenses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-500 text-sm">No expenses yet</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {data.expenses.map((expense) => {
                const catInfo = CATEGORY_INFO[expense.category] || {
                  label: expense.category,
                  icon: "📦",
                };

                return (
                  <div
                    key={expense.id}
                    className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Category Icon */}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="text-lg">{catInfo.icon}</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {expense.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {catInfo.label}
                          </span>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-xs text-slate-500">
                            {getNickname(expense.paidBy)}
                          </span>
                        </div>
                      </div>

                      {/* Amount & Delete */}
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          disabled={deleting === expense.id}
                          className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {deleting === expense.id ? (
                            <span className="text-xs text-red-400">...</span>
                          ) : (
                            <span className="text-red-400 text-sm">✕</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Expenses are split 50/50 between partners
        </p>
      </div>
    </div>
  );
}
