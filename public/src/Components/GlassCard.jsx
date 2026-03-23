import React from 'react';

/**
 * GlassCard – a reusable component that applies a glass‑morphism background
 * with optional animation. It accepts children to render inside the card.
 *
 * Props:
 *   children: ReactNode – content of the card
 *   className?: string – additional Tailwind classes
 *   animation?: string – Tailwind animation class (e.g., 'animate-slide-up')
 */
export default function GlassCard({ children, className = '', animation = '' }) {
    return (
        <div
            className={`relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg ${animation} ${className}`}
        >
            {/* Optional inner overlay for subtle shine */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
            <div className="relative">{children}</div>
        </div>
    );
}
