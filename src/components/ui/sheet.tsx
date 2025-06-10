import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
}

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  );
}

export function SheetContent({
  children,
  className = "",
  side = "right",
}: SheetContentProps) {
  const sideStyles = {
    right: "right-0 top-0 h-full w-full sm:max-w-lg translate-x-0",
    left: "left-0 top-0 h-full w-full sm:max-w-lg -translate-x-0",
    top: "top-0 left-0 w-full h-full sm:max-h-96 translate-y-0",
    bottom: "bottom-0 left-0 w-full h-full sm:max-h-96 translate-y-0",
  };

  return (
    <div
      className={cn(
        "fixed bg-background border shadow-lg animate-in slide-in-from-right duration-300",
        "flex flex-col",
        sideStyles[side],
        className
      )}
    >
      {children}
    </div>
  );
}

export function SheetHeader({ children, className }: SheetHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 border-b",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SheetTitle({ children, className }: SheetTitleProps) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function SheetDescription({
  children,
  className,
}: SheetDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}

export function SheetClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}
