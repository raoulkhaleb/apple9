import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#0a0a0a] font-dm">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-dm text-[#0a0a0a] placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
