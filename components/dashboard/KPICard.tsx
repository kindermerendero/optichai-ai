import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

type AccentColor = 'emerald' | 'blue' | 'amber' | 'violet'

interface KPICardProps {
  title: string
  value: string
  change: number
  description: string
  icon: LucideIcon
  color: AccentColor
  delay?: number
}

const colorMap: Record<AccentColor, {
  bar: string
  iconWrap: string
  iconText: string
  badgeBg: string
  badgeText: string
  dot: string
}> = {
  emerald: {
    bar: 'bg-emerald-500',
    iconWrap: 'bg-emerald-500/10 border-emerald-500/20',
    iconText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  blue: {
    bar: 'bg-blue-500',
    iconWrap: 'bg-blue-500/10 border-blue-500/20',
    iconText: 'text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    dot: 'bg-blue-500',
  },
  amber: {
    bar: 'bg-amber-500',
    iconWrap: 'bg-amber-500/10 border-amber-500/20',
    iconText: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    dot: 'bg-amber-500',
  },
  violet: {
    bar: 'bg-violet-500',
    iconWrap: 'bg-violet-500/10 border-violet-500/20',
    iconText: 'text-violet-400',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-400',
    dot: 'bg-violet-500',
  },
}

export function KPICard({
  title,
  value,
  change,
  description,
  icon: Icon,
  color,
  delay = 0,
}: KPICardProps) {
  const c = colorMap[color]
  const isPositive = change >= 0

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[#1E2D4A] bg-[#0D1422] p-5
        animate-slide-up transition-all duration-200
        hover:border-[#2A3A5C] hover:bg-[#0F1828] cursor-default group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${c.bar} opacity-80`} />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative">
        {/* Top row: icon + change badge */}
        <div className="flex items-start justify-between mb-5">
          <div className={`p-2.5 rounded-lg border ${c.iconWrap}`}>
            <Icon className={`w-[18px] h-[18px] ${c.iconText}`} />
          </div>

          <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full ${c.badgeBg} ${c.badgeText}`}>
            {isPositive
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />
            }
            {isPositive ? '+' : ''}{change}%
          </div>
        </div>

        {/* Metric */}
        <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.14em] mb-1.5">
          {title}
        </p>
        <p className="text-[2.1rem] font-bold text-[#EEF2FF] font-mono tabular-nums leading-none tracking-tight">
          {value}
        </p>

        {/* Description */}
        <p className="text-[11px] text-[#4B5563] mt-3 leading-snug">{description}</p>

        {/* Bottom accent dot */}
        <div className={`absolute bottom-0 right-0 w-1 h-1 rounded-full ${c.dot} opacity-60 m-4`} />
      </div>
    </div>
  )
}
