"use client";
import { BanknoteArrowDownIcon } from "lucide-react";

export default function ExpenseSettlement({ expenses, clearExpense }) {
  function generateCSV() {
    if (!expenses || expenses.length === 0) return;
    const headers = Object.keys(expenses[0]);
    const rows = expenses.map((item) =>
      headers.map((h) => JSON.stringify(item[h] ?? "")).join(","),
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();

    URL.revokeObjectURL(url);
  }
  function handleSettlement() {
    generateCSV();
    setTimeout(() => {
      clearExpense();
    }, 1000);
  }

  return (
    <div>
      <div>
        <BanknoteArrowDownIcon className="mx-10" onClick={handleSettlement} />
      </div>
    </div>
  );
}
