import ExpenseContent from "@/content/expense";
import ExpenseCallout from "@/ui/components/expenseCallout";
import ExpenseFooter from "@/ui/components/expenseFooter";
import ExpenseMetric from "@/ui/components/expenseMetrics";

export default function ExpensePage() {
  return (
    <div className="relative min-h-dvh pb-10">
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
            expense="$2345"
            owed="$1234"
            expenseDesc={ExpenseContent.expenseThisMonth}
            owedDesc={ExpenseContent.amountOwed}
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
          <ExpenseCallout
            title="Swiggy Order"
            category="Groceries"
            amount={1000}
            date="12 Aug 2024"
          ></ExpenseCallout>
          <ExpenseCallout
            title="Swiggy Order"
            category="Bills"
            amount="1000 INR"
            date="12 Aug 2024"
          ></ExpenseCallout>
          <ExpenseCallout
            title="Swiggy Order"
            category="Entertainment"
            amount="1000 INR"
            date="12 Aug 2024"
          ></ExpenseCallout>
          <ExpenseCallout
            title="Swiggy Order"
            category="Miscellaneous"
            amount="1000 INR"
            date="12 Aug 2024"
          ></ExpenseCallout>
          <ExpenseCallout
            title="Swiggy Order"
            category="Food"
            amount="1000 INR"
            date="12 Aug 2024"
          ></ExpenseCallout>
          <ExpenseCallout
            title="Swiggy Order"
            category="Food"
            amount="1000 INR"
            date="12 Aug 2024"
          ></ExpenseCallout>
          <ExpenseCallout
            title="Swiggy Order"
            category="Food"
            amount="1000 INR"
            date="12 Aug 2024"
          ></ExpenseCallout>
        </div>
      </div>
      <ExpenseFooter user1="Thumbi" user2="Poopu"></ExpenseFooter>
    </div>
  );
}
