"use client";

import { useState, useEffect } from "react";
import { getCoupleNicknames, addExpense } from "@/app/_lib/firestore/expense";
import SubmitButton from "@/app/_components/SubmitButton";

const CATEGORIES = [
  { value: "food", label: "Food", icon: "🍔" },
  { value: "bill", label: "Bill", icon: "📄" },
  { value: "grocery", label: "Grocery", icon: "🛒" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "miscellaneous", label: "Miscellaneous", icon: "📦" },
];

export default function AddExpensePage() {
  const [nicknames, setNicknames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchNicknames() {
      try {
        const data = await getCoupleNicknames();
        setNicknames(data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchNicknames();
  }, []);

  async function handleSubmit(formData) {
    setError(null);
    setSuccess(null);
    try {
      const result = await addExpense(formData);
      setSuccess(`💰 Expense "${result.expense.title}" added successfully!`);
      // Reset form by forcing re-render
      document.getElementById("expense-form").reset();
    } catch (err) {
      setError(err.message || "Failed to add expense");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  if (!nicknames) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center">
          <p className="text-slate-400">
            Unable to load data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-2xl">💸</span>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
              Add Expense
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Track your spending together
            </p>
          </div>

          <form id="expense-form" action={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat, index) => (
                  <label key={cat.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      defaultChecked={index === 0}
                      className="peer sr-only"
                    />
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-center transition-all peer-checked:border-teal-500 peer-checked:bg-teal-500/10 hover:bg-white/10">
                      <span className="text-xl block mb-1">{cat.icon}</span>
                      <span className="text-xs text-slate-400 peer-checked:text-teal-300">
                        {cat.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g., Dinner at restaurant"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Paid By */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Paid By
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="paidBy"
                    value={nicknames.currentUser.id}
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center transition-all peer-checked:border-teal-500 peer-checked:bg-teal-500/10 hover:bg-white/10">
                    <span className="text-2xl block mb-2">👤</span>
                    <span className="text-sm text-slate-300 peer-checked:text-teal-300 font-medium">
                      {nicknames.currentUser.nickname}
                    </span>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="paidBy"
                    value={nicknames.partner.id}
                    className="peer sr-only"
                  />
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center transition-all peer-checked:border-teal-500 peer-checked:bg-teal-500/10 hover:bg-white/10">
                    <span className="text-2xl block mb-2">💕</span>
                    <span className="text-sm text-slate-300 peer-checked:text-teal-300 font-medium">
                      {nicknames.partner.nickname}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-emerald-400 text-sm text-center">
                  {success}
                </p>
              </div>
            )}

            <SubmitButton
              className="w-full py-3 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              pendingText="Adding..."
            >
              Add Expense 💰
            </SubmitButton>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Split expenses fairly with your partner
        </p>
      </div>
    </div>
  );
}
