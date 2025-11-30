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
  const radius = spinnerSize / 2 - 10

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
        
        .spinner-text {
          animation: spinnerRotate 3s linear infinite;
          transform-origin: center;
        }
      `}</style>

      <svg width={spinnerSize} height={spinnerSize} viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}>
        <defs>
          <path
            id="spinnerPath"
            d={`M ${spinnerSize / 2}, ${spinnerSize / 2} m 0, -${radius} a ${radius},${radius} 0 1,1 0,${radius * 2} a ${radius},${radius} 0 1,1 0,-${radius * 2}`}
            fill="none"
          />
        </defs>

        {/* Rotating text along circular path */}
        <g className="spinner-text">
          <text
            fontSize="16"
            fontWeight="700"
            letterSpacing="2"
            fill="currentColor"
            className="text-primary"
          >
            <textPath href="#spinnerPath" startOffset="0%" textAnchor="start">
              owoabenes • owoabenes • owoabenes •{" "}
            </textPath>
          </text>
        </g>

        {/* Animated gradient ring */}
        <circle
          cx={spinnerSize / 2}
          cy={spinnerSize / 2}
          r={radius}
          fill="none"
          stroke="url(#gradientRing)"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * radius * 0.3}`}
          strokeDashoffset="0"
          style={{
            animation: "spinnerRotate 2s linear infinite",
          }}
        />

        <defs>
          <linearGradient id="gradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" />
            <stop offset="100%" stopColor="var(--color-accent, #a855f7)" />
          </linearGradient>
        </defs>
      </svg>

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
