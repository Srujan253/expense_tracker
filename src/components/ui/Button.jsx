import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-soft hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-soft",
    outline: "border border-neutral-200 bg-transparent hover:bg-neutral-100 text-neutral-900",
    ghost: "hover:bg-neutral-100 hover:text-neutral-900",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-12 px-6 py-3",
    sm: "h-9 rounded-lg px-3",
    lg: "h-14 rounded-xl px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          className
        )
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
