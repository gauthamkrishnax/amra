import { Suspense } from "react";

import ExpenseList from "@/ui/components/expenseList";
import ExpenseLoadingSkeleton from "@/ui/components/expenseLoadingSkeleton";

export default function ExpensePage() {
  return (
    <div className="relative min-h-dvh pb-10">
      <Suspense fallback={<ExpenseLoadingSkeleton />}>
        <ExpenseList />
      </Suspense>
    </div>
  );
}
