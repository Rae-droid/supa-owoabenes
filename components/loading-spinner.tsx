"use client"

interface LoadingSpinnerProps {
  version?: 1 | 2 | 3 | 4 | 5 | 6
  label?: string
}

export default function LoadingSpinner({ version = 1, label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {version === 1 && <SpinnerV1 />}
      {version === 2 && <SpinnerV2 />}
      {version === 3 && <SpinnerV3 />}
      {version === 4 && <SpinnerV4 />}
      {version === 5 && <SpinnerV5 />}
      {version === 6 && <SpinnerV6 />}

      {label && <p className="text-sm font-medium text-primary">{label}</p>}
    </div>
  )
}

/* ---------------------------------------------------
   VERSION 1 — GLOW ARC SPINNER
----------------------------------------------------*/
function SpinnerV1() {
  return (
    <div className="relative w-32 h-32">
      <style>{`
        @keyframes rotate360 {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes floatText {0%,100%{opacity:.7;transform:translateY(2px)}50%{opacity:1;transform:translateY(-2px)}}
      `}</style>

      <svg className="absolute inset-0 animate-[rotate360_2s_linear_infinite]" width="128" height="128">
        <defs>
          <linearGradient id="gradV1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        <circle
          cx="64" cy="64" r="50"
          stroke="url(#gradV1)"
          strokeWidth="6"
          strokeDasharray="110 300"
          strokeLinecap="round"
          fill="none"
          className="drop-shadow-[0_0_10px_rgba(168,85,247,.7)]"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-primary font-bold animate-[floatText_2s_ease_in_out_infinite]">
          owoabenes
        </p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------
   VERSION 2 — NEON LIQUID ARC
----------------------------------------------------*/
function SpinnerV2() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <style>{`
        @keyframes neonPulse {0%{filter:drop-shadow(0 0 5px #3b82f6)}50%{filter:drop-shadow(0 0 14px #a855f7)}100%{filter:drop-shadow(0 0 5px #3b82f6)}}
        @keyframes dashRotate {100%{stroke-dashoffset:-500}}
      `}</style>

      <svg width="130" height="130" className="animate-[neonPulse_2.8s_linear_infinite]">
        <defs>
          <linearGradient id="gradV2" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        <circle
          cx="65" cy="65" r="50"
          stroke="url(#gradV2)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="140 300"
          className="animate-[dashRotate_1.8s_linear_infinite]"
        />
      </svg>

      <p className="font-bold text-primary absolute bottom-[-2rem]">owoabenes</p>
    </div>
  )
}

/* ---------------------------------------------------
   VERSION 3 — LIQUID FILL TEXT
----------------------------------------------------*/
function SpinnerV3() {
  return (
    <div className="relative w-40 h-20 flex items-center justify-center">
      <style>{`
        @keyframes fillLiquid {
          0% {clip-path: inset(90% 0 0 0);}
          100% {clip-path: inset(0 0 0 0);}
        }
      `}</style>

      <p className="text-3xl font-extrabold text-primary relative">
        owoabenes
        <span
          className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent animate-[fillLiquid_2s_ease_in_out_infinite_alternate]"
        >
          owoabenes
        </span>
      </p>
    </div>
  )
}

/* ---------------------------------------------------
   VERSION 4 — 3D SPINNING SPHERE
----------------------------------------------------*/
function SpinnerV4() {
  return (
    <div className="flex flex-col items-center">
      <style>{`
        @keyframes spin3D {
          0% {transform: rotateX(0) rotateY(0);}
          100% {transform: rotateX(360deg) rotateY(360deg);}
        }
      `}</style>

      <div
        className="w-28 h-28 rounded-full animate-[spin3D_3s_linear_infinite]"
        style={{
          background: "radial-gradient(circle at 30% 30%, #a855f7, #3b82f6 70%)",
          boxShadow: "0 0 25px rgba(168,85,247,.7)",
        }}
      ></div>

      <p className="text-primary font-semibold mt-3">owoabenes</p>
    </div>
  )
}

/* ---------------------------------------------------
   VERSION 5 — NEON PARTICLE RING
----------------------------------------------------*/
function SpinnerV5() {
  return (
    <div className="relative w-32 h-32">
      <style>{`
        @keyframes rotateParticles {100%{transform:rotate(360deg)}}
      `}</style>

      <div className="absolute inset-0 rounded-full border-2 border-transparent animate-[rotateParticles_2.4s_linear_infinite]"
        style={{
          borderImage: "conic-gradient(#3b82f6, #a855f7, #3b82f6) 1",
        }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-primary font-semibold">owoabenes</p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------
   VERSION 6 — TEXT REVEAL LOADER
----------------------------------------------------*/
function SpinnerV6() {
  return (
    <div className="relative">
      <style>{`
        @keyframes reveal {
          0% {opacity:0; letter-spacing:8px;}
          100% {opacity:1; letter-spacing:2px;}
        }
      `}</style>

      <p className="text-2xl font-extrabold text-primary animate-[reveal_1.8s_ease_in_out_infinite_alternate]">
        owoabenes
      </p>
    </div>
  )
}
