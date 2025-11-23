import { revalidatePath } from "next/cache";

import ExpenseContent from "@/content/expense";
import {
  readCoupleData,
  writeCoupleData,
} from "@/lib/firebase/firestore-server";
import ExpenseCallout from "@/ui/components/expenseCallout";
import ExpenseFooter from "@/ui/components/expenseFooter";
import ExpenseMetric from "@/ui/components/expenseMetrics";

export default async function ExpenseList() {
  const couple = await readCoupleData();

  const totalExpenses = couple.expenses?.reduce(
    (acc, expense) => acc + Number(expense.amount),
    0,
  );

  const calcOwed = (exp, a = "Poopu", b = "Thumbi") => {
    const t = (n) =>
      exp.filter((e) => e.paidBy === n).reduce((s, e) => s + +e.amount, 0);
    const A = t(a),
      B = t(b);
    return A === B
      ? { string: "Both are settled", amount: 0 }
      : A > B
        ? { string: `${b} owes ${a}`, amount: A - B }
        : { string: `${a} owes ${b}`, amount: B - A };
  };

  const { string: owedString, amount: owedAmount } = calcOwed(
    couple.expenses,
    couple.users[0].nickname,
    couple.users[1].nickname,
  );

  const addExpense = async (expense) => {
    "use server";
    const couple = await readCoupleData();
    await writeCoupleData({
      expenses: couple.expenses
        ? [...couple.expenses, expense].slice(0, 40)
        : [expense],
    });
    revalidatePath("/expense");
  };

  const removeExpense = async (expenseId) => {
    "use server";
    const couple = await readCoupleData();
    await writeCoupleData({
      expenses: couple.expenses.filter((expense) => expense.id !== expenseId),
    });
    revalidatePath("/expense");
  };

  return (
    <>
      <div className="relative">
        <div className="bg-accent h-35 rounded-b-[40] drop-shadow-2xl">
          <h1 className="text-md mx-10 pt-12 font-bold">
            {ExpenseContent.title}
          </h1>
          <p className="mx-10 text-xs italic">{ExpenseContent.description}</p>
        </div>
        <div className="absolute right-0 -bottom-10 left-0">
          {" "}
          <ExpenseMetric
            expense={`₹${parseFloat(totalExpenses).toLocaleString("en-IN")}`}
            owed={`₹${parseFloat(owedAmount).toLocaleString("en-IN")}`}
            expenseDesc={ExpenseContent.expenseThisMonth}
            owedDesc={owedString}
          ></ExpenseMetric>
        </div>
      </div>
      <div className="mx-10 mt-16">
        <p className="mb-2 text-sm font-medium">
          {ExpenseContent.recentExpenses}
        </p>
      </div>
      <div>
        <div className="bg-accent shadow-top max-h-96 overflow-y-auto rounded-t-[40] p-5">
          {couple.expenses?.map((expense) => (
            <ExpenseCallout
              removeExpense={removeExpense}
              expenseId={expense.id}
              key={expense.id}
              title={expense.title}
              category={expense.category}
              amount={parseFloat(expense.amount).toLocaleString("en-IN")}
              date={expense.date}
              paidBy={expense.paidBy}
            ></ExpenseCallout>
          ))}
        </div>
      </div>
      <ExpenseFooter user1="Thumbi" user2="Poopu" addExpense={addExpense} />
    </>
  );
}
