export default function BoringButton({
  children,
  action,
  className,
  disabled = false,
}) {
  return (
    <button
      onClick={action}
      type="submit"
      disabled={disabled}
      className={
        className || "px-4 py-2 bg-primary text-white font-bold text-base"
      }
    >
      {children}
    </button>
  );
}
