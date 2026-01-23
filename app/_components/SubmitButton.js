"use client";

import { useFormStatus } from "react-dom";
import BoringButton from "./ui/BoringButton";

export default function SubmitButton({ children, pendingText, className }) {
  const { pending } = useFormStatus();

  return (
    <BoringButton type="submit" disabled={pending} className={className}>
      {pending ? pendingText || "Loading..." : children}
    </BoringButton>
  );
}
