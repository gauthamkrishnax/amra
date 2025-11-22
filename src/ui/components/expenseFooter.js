"use client";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

import ExpenseContent from "@/content/expense";
import AddExpenseButton from "@/ui/components/addExpenseButton";

import CategoryDropDown from "./categoryDropDown";
import TextBox from "./textbox";

export default function ExpenseFooter({ user1, user2 }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const handleSubmit = (user) => {
    setPaidBy(user);
    const expenseData = {
      title,
      amount,
      category,
      paidBy: user,
      date: new Date().toISOString(),
    };
    console.log("Submitted :", expenseData);
  };

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
                <CategoryDropDown setCategory={setCategory}></CategoryDropDown>
                <div className="flex gap-5">
                  <TextBox
                    placeholder="Title"
                    variant="borderBottom"
                    setValue={setTitle}
                  ></TextBox>
                  <TextBox
                    placeholder="Amount"
                    variant="borderBottom"
                    setValue={setAmount}
                  ></TextBox>
                </div>
                <p className="text-white-300 text-center text-[10px] font-bold">
                  {ExpenseContent.whoPaid}
                </p>
                <div className="flex w-full justify-center px-2">
                  <div
                    className={`shadow-top text-accent m-3 min-w-30 rounded-full bg-white px-4 py-2 text-center`}
                    onClick={() => handleSubmit(user1)}
                  >
                    {user1}
                  </div>
                  <div
                    className={`shadow-top bg-secondary text-accent m-3 min-w-30 rounded-full px-4 py-2 text-center`}
                    onClick={() => handleSubmit(user2)}
                  >
                    {user2}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      }
    </AnimatePresence>
  );
}
