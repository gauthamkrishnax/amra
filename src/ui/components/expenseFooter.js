"use client";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

import ExpenseContent from "@/content/expense";
import AddExpenseButton from "@/ui/components/addExpenseButton";

import CategoryDropDown from "./categoryDropDown";
import TextBox from "./textbox";
import WhoPaidButton from "./whoPaidButton";

export default function ExpenseFooter() {
  const [open, setOpen] = useState(false);
  return (
    <AnimatePresence>
      {
        <motion.div
          animate={open ? { y: -250 } : { y: 0 }}
          transition={{ duration: 0.5 }}
          className="shadow-top-darker bg-accent absolute bottom-0 h-20 w-full rounded-t-2xl"
        >
          <AddExpenseButton open={open} setOpen={setOpen}></AddExpenseButton>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={false}
                exit={{
                  y: 0,
                  transition: { delay: 0.5 },
                }}
                className="bg-accent absolute top-full right-0 left-0 -mt-1 h-60 px-5 shadow-lg"
              >
                <CategoryDropDown></CategoryDropDown>
                <div className="flex gap-5">
                  <TextBox placeholder="Title" variant="borderBottom"></TextBox>
                  <TextBox
                    placeholder="Amount"
                    variant="borderBottom"
                  ></TextBox>
                </div>
                <p className="text-white-300 text-center text-[10px] font-bold">
                  {ExpenseContent.whoPaid}
                </p>
                <div className="flex w-full justify-center px-2">
                  <WhoPaidButton variant="thumbi">Thumbi</WhoPaidButton>
                  <WhoPaidButton variant="poopu">Poopu</WhoPaidButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      }
    </AnimatePresence>
  );
}
