export default function TextInput({ id, label, placeholder, name }) {
  return (
    <div>
      <label className="block text-xl font-bold text-primary mb-2" htmlFor={id}>
        {label}
      </label>
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
