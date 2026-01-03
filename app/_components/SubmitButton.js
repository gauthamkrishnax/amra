"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText, className }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ||
        "bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {pending ? pendingText || "Loading..." : children}
    </button>
  );
}
