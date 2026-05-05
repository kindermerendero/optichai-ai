import {
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Bell,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { KPICard } from '@/components/dashboard/KPICard'
import { InventoryTable } from '@/components/dashboard/InventoryTable'
import { UploadButton } from '@/components/dashboard/UploadButton'

export default function DashboardPage() {
  return (
    <AppShell>
      {/* Page header */}
      <div className="border-b border-[#1E2D4A] bg-[#070B14]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-bold text-[#E2E8F0] font-display tracking-tight">
              Dashboard
            </h1>
            <p className="text-[11px] text-[#6B7A9F] mt-px">
              Operations overview · Q4 2024
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-transparent hover:border-[#1E2D4A] hover:bg-[#0D1422] text-[#6B7A9F] hover:text-[#94A3B8] transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="relative p-2 rounded-lg border border-transparent hover:border-[#1E2D4A] hover:bg-[#0D1422] text-[#6B7A9F] hover:text-[#94A3B8] transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1422] border border-[#1E2D4A]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-[#94A3B8]">Live</span>
              <span className="text-[11px] text-[#4B5563]">· updated 2 min ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="px-8 py-7 space-y-7">

        {/* KPI grid */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            title="Inventory Value"
            value="$2.4M"
            change={8.2}
            description="Total warehouse valuation across all SKUs"
            icon={DollarSign}
            color="emerald"
            delay={0}
          />
          <KPICard
            title="Out-of-Stock Risk"
            value="12%"
            change={-3.1}
            description="Items currently below reorder threshold"
            icon={AlertTriangle}
            color="amber"
            delay={100}
          />
          <KPICard
            title="Turnover Ratio"
            value="4.2x"
            change={0.6}
            description="Annual inventory rotations vs 3.6x industry avg"
            icon={RotateCcw}
            color="blue"
            delay={200}
          />
          <KPICard
            title="Potential Savings"
            value="$186K"
            change={14.3}
            description="Estimated gains from EOQ lot optimization"
            icon={Sparkles}
            color="violet"
            delay={300}
          />
        </div>

        {/* Inventory overview */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-[13px] font-bold text-[#E2E8F0] font-display tracking-tight">
                Inventory Overview
              </h2>
              <p className="text-[11px] text-[#6B7A9F] mt-0.5">
                8 products&nbsp;·&nbsp;
                <span className="text-amber-400">3 at risk</span>&nbsp;·&nbsp;
                <span className="text-blue-400">2 overstock</span>
              </p>
            </div>
            <UploadButton />
          </div>

          <InventoryTable />
        </div>
      </div>
    </AppShell>
  )
}
