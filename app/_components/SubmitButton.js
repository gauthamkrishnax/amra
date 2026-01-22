"use client";

import { useFormStatus } from "react-dom";
import BoringButton from "./ui/BoringButton";

export default function SubmitButton({ children, pendingText }) {
  const { pending } = useFormStatus();

  return (
    <BoringButton type="submit" disabled={pending}>
      {pending ? pendingText || "Loading..." : children}
    </BoringButton>
  );
}
