export default function ExpenseBox(props) {
  const styles = {
    variant: {
      normal: "text-complimentary",
      highlighted: "text-primary",
    },
  };

  return (
    <div className="flex w-1/2 flex-col items-center justify-center rounded-2xl bg-zinc-300 px-5 py-1">
      <h2
        className={`text-complimentary font-bold ${styles.variant[props.variant ? props.variant : "normal"]}`}
      >
        {props.number}
      </h2>
      <p className="text-complimentary text-center text-xs font-normal">
        {props.text}
      </p>
    </div>
  );
}
