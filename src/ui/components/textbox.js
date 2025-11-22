export default function Textbox({
  children,
  variant = "outline",
  setValue,
  ...props
}) {
  const variants = {
    outline: "border border-gray-300 rounded-xl",
    filled: "bg-gray-100 text-accent rounded-xl",
    borderBottom: "border-b border-gray-300",
  };
  return (
    <div
      className="my-5 flex flex-col gap-2"
      onChange={(e) => setValue(e.target.value)}
    >
      <label className="flex flex-col gap-2 font-bold">{props.label}</label>
      <input className={`w-full p-3 ${variants[variant]}`} {...props} />
    </div>
  );
}
