export default function FancyTextInput({
  id,
  label,
  description,
  placeholder,
  name,
  variation,
}) {
  const baseClasses = "px-10 py-5";
  const variationClasses = {
    yellow: "bg-myyellow",
    blue: "bg-myblue",
    green: "bg-mygreen",
    purple: "bg-mypurple",
  }[variation ? variation : "yellow"];
  return (
    <div className={`${baseClasses} ${variationClasses}`}>
      <label className="block text-xl font-bold text-primary mb-2" htmlFor={id}>
        {label}
      </label>
      <p className="text-primary mb-2">{description}</p>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        name={name}
        className="w-full p-2 border-0 border-b-2 border-gray-300 mb-2 max-w-md"
      />
    </div>
  );
}
