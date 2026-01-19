export default function BoringButton({ children, action, className }) {
  return (
    <button
      onClick={action}
      type="submit"
      className={
        className || "px-4 py-2 bg-primary text-white font-bold text-base"
      }
    >
      {children}
    </button>
  );
}
