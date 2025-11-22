import { useState } from "react";

export default function CategoryDropDown({ setCategory }) {
  return (
    <div className="flex flex-col gap-1">
      <select
        className="w-full rounded-xl border border-gray-300 p-2 font-light text-zinc-300"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled hidden>
          Select Category
        </option>
        <option value="Food">Food</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Groceries">Groceries</option>
        <option value="Miscellaneous">Miscellaneous</option>
      </select>
    </div>
  );
}
