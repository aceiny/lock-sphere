"use client"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const alertDialogVariants = cva(
  "relative flex w-full flex-col overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

export const dialogVariants = cva(
  "relative flex w-full flex-col overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export function AlertDialog({ className, ...props }: any) {
  return <div className={cn(alertDialogVariants({}), className)} {...props} />
}

export function AlertDialogAction({ className, ...props }: any) {
  return <button className={cn("text-white bg-primary hover:bg-primary/90", className)} {...props} />
}

export function AlertDialogCancel({ className, ...props }: any) {
  return <button className={cn("text-muted-foreground hover:bg-muted/20", className)} {...props} />
}

export function AlertDialogContent({ className, ...props }: any) {
  return <div className={className} {...props} />
}

export function AlertDialogDescription({ className, ...props }: any) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: any) {
  return <div className={cn("flex items-center justify-end gap-2 p-4", className)} {...props} />
}

export function AlertDialogHeader({ className, ...props }: any) {
  return <div className={cn("flex items-center justify-between p-4", className)} {...props} />
}

export function AlertDialogTitle({ className, ...props }: any) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

export function Badge({ className, ...props }: any) {
  return <div className={cn(badgeVariants({}), className)} {...props} />
}

export function Button({ className, ...props }: any) {
  return <button className={className} {...props} />
}

export function Dialog({ className, ...props }: any) {
  return <div className={cn(dialogVariants({}), className)} {...props} />
}

export function DialogContent({ className, ...props }: any) {
  return <div className={className} {...props} />
}

export function DialogDescription({ className, ...props }: any) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function DialogFooter({ className, ...props }: any) {
  return <div className={cn("flex items-center justify-end gap-2 p-4", className)} {...props} />
}

export function DialogHeader({ className, ...props }: any) {
  return <div className={cn("flex items-center justify-between p-4", className)} {...props} />
}

export function DialogTitle({ className, ...props }: any) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

export function Input({ className, ...props }: any) {
  return <input className={className} {...props} />
}

export function Label({ className, ...props }: any) {
  return <label className={className} {...props} />
}

export function X({ className, ...props }: any) {
  return (
    <svg
      className={className}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

