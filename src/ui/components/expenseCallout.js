"use client";
import {
  Clapperboard,
  CookingPot,
  Receipt,
  ShoppingBagIcon,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";

import { useState } from "react";

import ExpenseContent from "@/content/expense";

function Icons(name) {
  switch (name) {
    case "miscellaneous":
      return <ShoppingBasket className="text-black" size={20} />;
    case "food":
      return <CookingPot className="text-black" size={20} />;
    case "groceries":
      return <ShoppingCart className="text-black" size={20} />;
    case "entertainment":
      return <Clapperboard className="text-black" size={20} />;
    case "bills":
      return <Receipt className="text-black" size={20} />;
    default:
      return <ShoppingBagIcon className="text-black" size={20} />;
  }
}

export default function ExpenseCallout(props) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="my-2 flex items-center justify-between gap-5 rounded-full border border-gray-300 px-3 shadow-md"
      onClick={() => setShowDelete(true)}
    >
      {showDelete ? (
        <div className="w-full py-4 text-center">
          <p className="text-sm font-semibold text-white">
            {ExpenseContent.deleteExpense}
          </p>

          <div className="mt-3 flex justify-center gap-5">
            <button
              className="rounded-full bg-red-500 px-4 py-2 text-xs text-white"
              onClick={() => alert("Think again")}
            >
              Delete
            </button>
            <button
              className="rounded-full bg-gray-300 px-4 py-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
              {Icons(props.category.toLowerCase())}
            </div>
            <div className="flex flex-col justify-center py-4">
              <h2 className="text-xs font-bold">{props.title}</h2>
              <p className="text-[10px] font-medium text-zinc-400">
                {props.category} | {props.date}
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-bold">{props.amount}</h2>
          </div>
        </>
      )}
    </div>
  );
}
