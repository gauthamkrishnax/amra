"use client";
import { PlusIcon } from "lucide-react";

export default function AddExpenseButton() {
  return (
    <div
      className="absolute right-40 bottom-10 flex items-center justify-center"
      onClick={() => alert("Add Expense Clicked!")}
    >
      <div className="shadow-top-bottom-darker bg-accent flex h-15 w-15 items-center justify-center rounded-full">
        <PlusIcon size={40}></PlusIcon>
      </div>
    </div>
  );
}
