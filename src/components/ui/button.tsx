import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
          {
            "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg": variant === "default",
            "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg": variant === "destructive",
            "border-2 border-green-600 bg-white text-green-700 hover:bg-green-50 shadow-md hover:shadow-lg font-semibold": variant === "outline",
            "bg-white text-gray-800 hover:bg-gray-50 shadow-md hover:shadow-lg font-semibold border border-gray-200": variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "text-green-600 underline-offset-4 hover:underline hover:text-green-700": variant === "link",
          },
          {
            "h-12 px-6 py-3 text-base font-semibold": size === "default",
            "h-9 rounded-md px-3 text-sm": size === "sm",
            "h-14 rounded-md px-8 text-lg font-semibold": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }