export default function Button({ children, ...props }) {
  return (
    <button
      onClick={props.onClick}
      className={`text-accent relative z-10 my-5 flex max-w-fit min-w-3xs items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 font-bold ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
