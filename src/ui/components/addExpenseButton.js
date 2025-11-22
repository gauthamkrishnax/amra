"use client";
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

export default function AddExpenseButton(props) {
  return (
    <div
      className="absolute right-40 bottom-10 flex items-center justify-center"
      onClick={() => props.setOpen(!props.open)}
    >
      <div className="shadow-top-bottom-darker bg-accent flex h-15 w-15 items-center justify-center rounded-full">
        <PlusIcon size={40}></PlusIcon>
      </div>
    </div>
  );
}
