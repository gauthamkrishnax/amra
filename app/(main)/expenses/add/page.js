"use client";

import { useState, useEffect } from "react";
import { getCoupleNicknames, addExpense } from "@/app/_lib/firestore/expense";
import SubmitButton from "@/app/_components/SubmitButton";
import Divider from "@/app/_components/ui/Divider";
import LinkButton from "@/app/_components/ui/LinkButton";

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
      <div className="min-h-screenflex items-center justify-center">
        <div className="animate-pulse text-mygreen">Loading...</div>
      </div>
    );
  }

  if (!nicknames) {
    return (
      <div className="min-h-screen items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center">
          <p className="text-slate-400">
            Unable to load data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-2 mx-10 flex justify-between">
        <LinkButton href="#" color="blue" shape="shape4">
          <h1 className="text-2xl font-bold">Add Expenses</h1>
        </LinkButton>
        <LinkButton href="/expenses" color="red">
          <span className="text-sm"> &larr; back</span>
        </LinkButton>
      </div>

      <Divider />

      <form id="expense-form" action={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div className="px-10 my-5">
          <label className="block text-sm font-bold mb-3">
            Select Category
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
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-center transition-all peer-checked:border-primary peer-checked:bg-mygreen/10 hover:bg-white/10">
                  <span className="text-3xl block mb-1">{cat.icon}</span>
                  <span className="text-xs text-primary">{cat.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Divider />

        {/* Title */}
        <div className="px-10 my-5">
          <label htmlFor="title" className="block text-sm font-bold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="e.g., Dinner at restaurant"
            className="w-full px-4 py-3 bg-white/5 border-b rounded-sm border-primary text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Amount */}
        <div className="px-10 my-5">
          <label htmlFor="amount" className="block text-sm font-bold mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ₹
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-white/5 border-b rounded-sm border-primary text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Paid By */}
        <div className="px-10 my-5">
          <label className="block text-sm font-bold mb-3">Paid By</label>
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
                <LinkButton noLink={true} color="yellow" shape="shape4">
                  <span className="text-xl font-bold text-primary peer-checked:text-teal-30">
                    {nicknames.currentUser.nickname}
                  </span>
                </LinkButton>
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
                <LinkButton noLink={true} color="blue" shape="shape4">
                  <span className="text-xl font-bold text-primary peer-checked:text-teal-30">
                    {nicknames.partner.nickname}
                  </span>
                </LinkButton>
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
            <p className="text-emerald-400 text-sm text-center">{success}</p>
          </div>
        )}
        <div className="px-10 my-5">
          <SubmitButton
            className="w-full py-3 text-myyellow bg-black font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            pendingText="Adding..."
          >
            + Add Expense
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
