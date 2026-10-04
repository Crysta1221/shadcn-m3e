"use client";

import { useEffect } from "react";
import { Toaster, toast } from "@/components/m3e/sonner";

/** A snackbar shown and left up, inside the box it is drawn in: the canvas draws what `toast()` would put on screen. */
export function SnackbarPreview({ message, action, closeButton }: { message: string; action?: string; closeButton?: boolean }) {
  useEffect(() => {
    const id = toast(message, { duration: Infinity, closeButton, action: action ? { label: action, onClick: () => {} } : undefined });
    return () => {
      toast.dismiss(id);
    };
  }, [message, action, closeButton]);
  return <Toaster />;
}
