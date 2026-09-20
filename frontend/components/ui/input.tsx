import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "border-input bg-background flex h-10 w-full rounded-md border px-3 py-2",
        "text-foreground text-sm",
        "placeholder:text-muted-foreground",
        "outline-none",
        "transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
