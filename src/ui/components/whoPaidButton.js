const style = {
  variant: {
    thumbi: "bg-white",
    poopu: "bg-secondary",
  },
};
export default function WhoPaidButton({ children, variant = "thumbi" }) {
  return (
    <div
      className={`shadow-top text-accent m-3 min-w-30 rounded-full px-4 py-2 text-center ${style.variant[variant]}`}
      onClick={() => alert(`${children} paid!`)}
    >
      {children}
    </div>
  );
}
