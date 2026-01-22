"use client";

import { useState, useEffect } from "react";
import { getCoupleDetails } from "@/app/_lib/firestore/couple";
import { deleteExpense } from "@/app/_lib/firestore/expense";
import Divider from "@/app/_components/ui/Divider";
import LinkButton from "@/app/_components/ui/LinkButton";
import Modal from "@/app/_components/ui/Modal";
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const result = await getCoupleDetails();
      setData(result);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(expenseId) {
    setDeleteTarget(expenseId);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(deleteTarget);
    setError(null);

    try {
      await deleteExpense(deleteTarget);
      setData((prev) => ({
        ...prev,
        expenses: prev.expenses.filter((e) => e.id !== deleteTarget),
      }));
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
      fetchData();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-pulse text-myblue">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-mypink">
            Unable to load expenses. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const now = new Date();

  // Use monthlyTotal from getCoupleDetails
  const { monthlyTotal, currentUserOwes, partnerOwes } = data;

  const getNickname = (userId) => {
    if (userId === data.userId) return data.userNickname;
    if (userId === data.partnerId) return data.partnerNickname;
    return "Unknown";
  };

  const getOweText = () => {
    if (currentUserOwes > 0) return `You owe ${data.partnerNickname}`;
    if (partnerOwes > 0) return `${data.partnerNickname} owes you`;
    return "All settled up!";
  };

  const getOweAmount = () => {
    if (currentUserOwes > 0) return currentUserOwes;
    if (partnerOwes > 0) return partnerOwes;
    return 0;
  };

  return (
    <div className="min-h-screen bg-linear-to-br">
      {/* Header */}
      <div className="my-2 mx-10">
        <LinkButton href="/" color="blue" shape="shape4">
          <h1 className="text-2xl font-bold ">Expenses</h1>
        </LinkButton>
      </div>
      <Divider />

      <div className="relative">
        <div className={`bg-myyellow pr-20 -rotate-6 p-5 max-w-fit m-8`}>
          <p>Monthly Spend</p>
          <p className={`text-2xl font-bold`}>₹ {monthlyTotal.toFixed(2)}</p>
        </div>
        <div
          className={`bg-mypink pr-10 p-5 max-w-fit m-8 absolute right-0 top-10`}
        >
          <p>
            {/* Who owes who */}
            {getOweText()}
          </p>
          <p className={`text-4xl font-bold`}>₹ {getOweAmount().toFixed(2)}</p>
        </div>
      </div>

      <Divider />

      <div className="px-5 my-10">
        <Link
          href="/expenses/add"
          className="block w-full py-4 px-4 bg-black text-xl tracking-wide text-mygreen font-bold rounded-md shadow-lg shadow-teal-500/25  text-center mb-4"
        >
          + Add Expense
        </Link>
      </div>
      {/* Add Expense Button */}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Expenses List */}
      <div>
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
                <div key={expense.id} className="p-4 border-b border-myblue/60">
                  <div className="flex items-start gap-3">
                    {/* Category Icon */}
                    <div className="p-2">
                      <span className="text-3xl">{catInfo.icon}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg truncate">
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
                    <div>
                      <div className="flex items-center gap-2">
                        <span className=" font-semibold">
                          ₹ {expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => openDeleteModal(expense.id)}
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
                      <div className="text-xs text-slate-500 text-right mt-2">
                        {new Date(expense.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        confirmText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this expense?</p>
      </Modal>
    </div>
  );
}
