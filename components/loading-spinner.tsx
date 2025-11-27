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
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const variantColors = {
    primary: "from-primary to-accent",
    secondary: "from-secondary to-primary",
    accent: "from-accent to-secondary",
  }

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes spinnerRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        
        .spinner-ring {
          animation: pulseRing 1.5s ease-out infinite;
        }
        
        .spinner-inner {
          animation: spinnerRotate 2s linear infinite;
        }
      `}</style>

      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div
          className={`absolute ${sizeClasses[size]} rounded-full border-2 border-transparent bg-gradient-to-r ${variantColors[variant]} spinner-ring opacity-50`}
          style={{
            background: `conic-gradient(from 0deg, var(--color-${variant}), transparent 70%)`,
          }}
        />

        {/* Middle spinning ring */}
        <div
          className={`absolute ${sizeClasses[size]} rounded-full border-3 border-transparent bg-gradient-to-r ${variantColors[variant]} spinner-inner`}
          style={{
            borderImage: `conic-gradient(from 0deg, var(--color-${variant}), transparent 40%) 1`,
          }}
        />

        {/* Inner static center */}
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${variantColors[variant]} flex items-center justify-center shadow-lg`}
        >
          <div className="w-2/3 h-2/3 rounded-full bg-background" />
        </div>
      </div>

      {label && <p className={`text-sm font-medium text-${variant}`}>{label}</p>}
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
