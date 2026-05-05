'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  Network,
  ChevronRight,
  Bell,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/forecasting', icon: TrendingUp, label: 'Forecasting' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#070B14] border-r border-[#1E2D4A] flex flex-col z-50 select-none">

      {/* Brand mark */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#1E2D4A] flex-shrink-0">
        <div className="relative w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
          <Network className="w-4 h-4 text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#070B14]" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#E2E8F0] font-display leading-none tracking-tight">
            OptiChain
          </p>
          <p className="text-[9px] text-emerald-500/80 font-mono uppercase tracking-[0.25em] mt-0.5">
            AI Platform
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-[9px] font-bold text-[#374151] uppercase tracking-[0.18em] px-3 mb-2.5">
          Operations
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald'
                    : 'text-[#6B7A9F] hover:bg-[#0D1422] hover:text-[#94A3B8] border border-transparent'
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-emerald-400' : 'group-hover:text-[#94A3B8]'
                  }`}
                />
                <span className="flex-1 font-medium">{label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="mt-6">
          <p className="text-[9px] font-bold text-[#374151] uppercase tracking-[0.18em] px-3 mb-2.5">
            System
          </p>
          <Link
            href="/settings"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              transition-all duration-150 border
              ${pathname === '/settings'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'text-[#6B7A9F] hover:bg-[#0D1422] hover:text-[#94A3B8] border-transparent'
              }
            `}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 font-medium">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Bottom — user block */}
      <div className="px-4 py-4 border-t border-[#1E2D4A] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white font-mono">
            MM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#94A3B8] truncate leading-tight">
              Operations Manager
            </p>
            <p className="text-[10px] text-[#374151] truncate mt-0.5">
              masmerenda@gmail.com
            </p>
          </div>
          <button className="p-1 rounded text-[#374151] hover:text-[#6B7A9F] transition-colors flex-shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
