"use client";
import { PlusIcon } from "lucide-react";

export default function AddExpenseButton(props) {
  return (
    <div
      className="absolute right-1/2 bottom-10 left-1/2 flex -translate-x-1/2 items-center justify-center"
      onClick={() => props.setOpen(!props.open)}
    >
      <div className="shadow-top-bottom-darker bg-accent flex items-center justify-center rounded-full p-3">
        <PlusIcon size={50}></PlusIcon>
      </div>
    </div>
  );
}
