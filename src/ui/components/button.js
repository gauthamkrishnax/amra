export default function Button({ children, ...props }) {
  return (
    <button
      className={`text-accent my-5 flex max-w-fit min-w-3xs items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
