export default function Button({ children, className, ...props }) {
  return (
    <button
      className={`text-accent relative z-10 my-5 flex max-w-fit min-w-3xs items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 font-bold ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
