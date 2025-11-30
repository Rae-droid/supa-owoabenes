"use client"

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "accent"
  fullScreen?: boolean
  label?: string
}

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  fullScreen = false,
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeMap = { sm: 80, md: 120, lg: 160 }
  const spinnerSize = sizeMap[size]
  const radius = spinnerSize / 2 - 12

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes rotate360 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatText {
          0% { letter-spacing: 2px; opacity: 0.7; }
          50% { letter-spacing: 4px; opacity: 1; }
          100% { letter-spacing: 2px; opacity: 0.7; }
        }
      `}</style>

      <div
        className="relative"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        {/* Rotating outer arc with glow */}
        <svg
          width={spinnerSize}
          height={spinnerSize}
          viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
          className="animate-[rotate360_2s_linear_infinite]"
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary,#3b82f6)" />
              <stop offset="100%" stopColor="var(--color-accent,#a855f7)" />
            </linearGradient>
          </defs>

          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={radius}
            stroke="url(#ringGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={2 * Math.PI * radius * 0.35}
            className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
          />
        </svg>

        {/* Center animated text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary font-bold text-base animate-[floatText_2.5s_ease_infinite]">
            owoabenes
          </span>
        </div>
      </div>

      {label && <p className="text-sm font-medium text-primary">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}
