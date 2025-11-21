export default function Textbox({ children, variant = "outline", ...props }) {
  const variants = {
    outline: "border border-gray-300",
    filled: "bg-gray-100",
  };
  return (
    <div className="my-5 flex flex-col gap-2">
      <label className="flex flex-col gap-2 font-bold">{props.label}</label>
      <input
        className={`w-full rounded-xl p-3 ${variants[variant]}`}
        {...props}
      />
    </div>
  );
}
