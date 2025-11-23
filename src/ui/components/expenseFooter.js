"use client";
import { AnimatePresence, motion } from "motion/react";

import { useState, useTransition } from "react";

import ExpenseContent from "@/content/expense";
import AddExpenseButton from "@/ui/components/addExpenseButton";

import CategoryDropDown from "./categoryDropDown";
import TextBox from "./textbox";

export default function ExpenseFooter({ user1, user2, addExpense }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (user) => {
    setPaidBy(user);

    if (title === "" || amount === "" || category === "") {
      const error = "Please fill in all fields!";
      setError(error);
      return;
    }

    const expenseData = {
      id: crypto.randomUUID(),
      title,
      amount,
      category,
      paidBy: user,
      date: new Date().toISOString(),
    };

    startTransition(async () => {
      await addExpense(expenseData);
      setOpen(false);
      setError("");
      setTitle("");
      setAmount("");
      setCategory("");
    });
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
          {error && (
            <p className="text-secondary mt-12 ml-5 text-[10px] font-bold">
              {error}
            </p>
          )}
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
                <CategoryDropDown
                  setCategory={setCategory}
                  value={category}
                ></CategoryDropDown>
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
                    type="number"
                  ></TextBox>
                </div>
                <p className="text-white-300 text-center text-[10px] font-bold">
                  {ExpenseContent.whoPaid}
                </p>
                {isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 flex justify-center gap-2"
                  >
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
                  </motion.div>
                )}
                <div className="flex w-full justify-center px-2">
                  <button
                    className={`shadow-top text-accent m-3 min-w-30 rounded-full bg-white px-4 py-2 text-center transition-opacity ${isPending ? "cursor-not-allowed opacity-50" : "hover:opacity-90"}`}
                    onClick={() => handleSubmit(user1)}
                    disabled={isPending}
                  >
                    {user1}
                  </button>
                  <button
                    className={`shadow-top bg-secondary text-accent m-3 min-w-30 rounded-full px-4 py-2 text-center transition-opacity ${isPending ? "cursor-not-allowed opacity-50" : "hover:opacity-90"}`}
                    onClick={() => handleSubmit(user2)}
                    disabled={isPending}
                  >
                    {user2}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      }
    </AnimatePresence>
  );
}
