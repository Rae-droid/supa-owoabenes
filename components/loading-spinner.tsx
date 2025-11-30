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
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  }

  const spinnerSize = sizeMap[size]
  const text = "owoabenes mothercare • "

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes spinnerRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0% { opacity: .7; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: .7; transform: scale(0.95); }
        }
        
        .text-circle {
          animation: spinnerRotate 8s linear infinite;
          transform-origin: center;
        }

        .glow-ring {
          animation: spinnerRotate 3s linear infinite, pulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative" style={{ width: spinnerSize, height: spinnerSize }}>
        <svg width={spinnerSize} height={spinnerSize} viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}>
          <defs>
            <path
              id="circleTextPath"
              d={`
                M ${spinnerSize / 2}, ${spinnerSize / 2}
                m 0, -${spinnerSize / 2 - 15}
                a ${spinnerSize / 2 - 15}, ${spinnerSize / 2 - 15} 0 1,1 0, ${spinnerSize - 30}
                a ${spinnerSize / 2 - 15}, ${spinnerSize / 2 - 15} 0 1,1 0, -${spinnerSize - 30}
              `}
              fill="none"
            />

            <linearGradient id="gradText" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" />
              <stop offset="100%" stopColor="var(--color-accent, #a855f7)" />
            </linearGradient>
          </defs>

          {/* Circular text */}
          <text
            fill="url(#gradText)"
            fontSize={spinnerSize / 10}
            fontWeight="700"
            className="text-circle tracking-[3px]"
          >
            <textPath href="#circleTextPath">
              {text.repeat(10)}
            </textPath>
          </text>

          {/* Glow animated center ring */}
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={spinnerSize / 2 - 25}
            stroke="url(#gradText)"
            strokeWidth="6"
            fill="none"
            className="glow-ring drop-shadow-[0_0_10px_rgba(168,85,247,.5)]"
            strokeDasharray={`${2 * Math.PI * (spinnerSize / 2 - 25) * 0.28}`}
          />
        </svg>

        {/* Soft white center */}
        <div
          className="absolute rounded-full bg-background"
          style={{
            width: spinnerSize * 0.45,
            height: spinnerSize * 0.45,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 25px rgba(255,255,255,0.2)",
          }}
        />
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
