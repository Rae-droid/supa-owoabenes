import * as React from "react"
import { cn } from "@/lib/utils"

type SpinnerProps = React.ComponentProps<"div">

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <div className="relative h-10 w-10">
        {/* Outer ring */}
        <span className="absolute inset-0 rounded-full border-4 border-pink-300 border-t-transparent animate-spin" />

        {/* Pulse dot */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-4 rounded-full bg-blue-300 opacity-75 animate-ping" />
        </span>
      </div>
    </div>
  )
}
