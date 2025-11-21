import ExpenseBox from "./expenseBox";

export default function ExpensePage(props) {
  return (
    <div className="mx-10 flex min-h-20 gap-5 rounded-2xl bg-zinc-200 p-3">
      <ExpenseBox number={props.expense} text={props.expenseDesc}></ExpenseBox>
      <ExpenseBox
        number={props.owed}
        text={props.owedDesc}
        variant="highlighted"
      ></ExpenseBox>
    </div>
  );
}
