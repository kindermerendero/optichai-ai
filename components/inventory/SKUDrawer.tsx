'use client'

import { useEffect } from 'react'
import { X, TrendingUp, TrendingDown, Minus, Package2, Clock, BarChart2 } from 'lucide-react'
import { AreaChart, LineChart } from '@tremor/react'
import { type InventoryItem, inventoryData, type StockStatus } from '@/lib/data'
import {
  performABCAnalysis,
  calculateEOQ,
  calculateAnnualCost,
  getHoldingCostRate,
  generateStockHistory,
  generateEOQCurve,
} from '@/lib/eoq'

const statusConfig: Record<StockStatus, { label: string; cls: string }> = {
  optimal: { label: 'Optimal', cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  low: { label: 'Low Stock', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  overstock: { label: 'Overstock', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
}

const abcConfig = {
  A: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  B: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  C: 'bg-[#1E2D4A]/60 text-[#6B7A9F] border border-[#1E2D4A]',
}

const trendConfig = {
  up: { Icon: TrendingUp, color: 'text-emerald-400' },
  down: { Icon: TrendingDown, color: 'text-red-400' },
  stable: { Icon: Minus, color: 'text-[#6B7A9F]' },
}

interface Props {
  item: InventoryItem | null
  onClose: () => void
}

export function SKUDrawer({ item, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const abcResults = performABCAnalysis(inventoryData)
  const abcItem = item ? abcResults.find((r) => r.id === item.id) : null

  const stockHistory = item ? generateStockHistory(item) : []
  const { points: costPoints, eoq } = item ? generateEOQCurve(item) : { points: [], eoq: 0 }

  const H = item ? getHoldingCostRate(item.unitValue) : 0
  const annualCost = item
    ? calculateAnnualCost(item.annualDemand, eoq, 40, H)
    : { orderingCost: 0, holdingCost: 0, totalCost: 0 }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          item ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full z-50 w-[580px] bg-[#080C14] border-l border-[#1E2D4A] flex flex-col transition-transform duration-300 ease-out ${
          item ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {!item ? null : (
          <>
            {/* Header */}
            <div className="flex-none px-7 pt-6 pb-5 border-b border-[#1E2D4A]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.14em] mb-1.5">SKU Detail</p>
                  <h2 className="text-[17px] font-bold text-[#E2E8F0] font-display tracking-tight leading-tight">
                    {item.product}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[11px] font-mono text-[#6B7A9F] bg-[#0D1422] border border-[#1E2D4A] px-2 py-0.5 rounded">
                      {item.sku}
                    </span>
                    <span className="text-[11px] text-[#6B7A9F]">{item.category}</span>
                    <span className={`status-badge text-[10px] ${statusConfig[item.status].cls}`}>
                      {statusConfig[item.status].label}
                    </span>
                    {abcItem && (
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${abcConfig[abcItem.class]}`}>
                        Class {abcItem.class}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-none p-2 rounded-lg text-[#4B5563] hover:text-[#94A3B8] hover:bg-[#0D1422] border border-transparent hover:border-[#1E2D4A] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-4 gap-2 mt-5">
                {[
                  { label: 'EOQ', value: `${eoq} units`, icon: Package2, color: 'text-emerald-400' },
                  { label: 'Lead Time', value: `${item.leadTimeDays} days`, icon: Clock, color: 'text-sky-400' },
                  { label: 'Annual Demand', value: item.annualDemand.toLocaleString(), icon: BarChart2, color: 'text-violet-400' },
                  { label: 'Annual Value', value: `$${((item.annualDemand * item.unitValue) / 1000).toFixed(1)}K`, icon: Package2, color: 'text-amber-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="px-3 py-2.5 rounded-lg bg-[#0D1422] border border-[#1E2D4A]">
                    <Icon className={`w-3 h-3 ${color} mb-1.5`} />
                    <p className={`text-[13px] font-bold font-mono tabular-nums ${color}`}>{value}</p>
                    <p className="text-[9px] text-[#4B5563] uppercase tracking-[0.1em] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

              {/* Stock History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.12em]">Stock Level</p>
                    <p className="text-[10px] text-[#4B5563] mt-0.5">Simulated 12-month history · units</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {[
                      { color: 'bg-emerald-500', label: 'Stock' },
                      { color: 'bg-amber-500', label: 'Reorder Pt.' },
                    ].map(({ color, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-[10px] text-[#6B7A9F]">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-[#1E2D4A] bg-[#0A0E1A] p-4">
                  <AreaChart
                    data={stockHistory}
                    index="month"
                    categories={['Stock Level', 'Reorder Point']}
                    colors={['emerald', 'amber']}
                    className="h-44"
                    showLegend={false}
                    showGridLines={true}
                    curveType="monotone"
                    showAnimation={true}
                  />
                </div>
              </div>

              {/* EOQ Cost Curve */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.12em]">
                      EOQ Cost Curve
                      <span className="ml-2 text-emerald-400 normal-case font-mono">Q* = {eoq}</span>
                    </p>
                    <p className="text-[10px] text-[#4B5563] mt-0.5">Annual cost vs order quantity · $</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {[
                      { color: 'bg-emerald-500', label: 'Total' },
                      { color: 'bg-blue-500', label: 'Ordering' },
                      { color: 'bg-amber-500', label: 'Holding' },
                    ].map(({ color, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-[10px] text-[#6B7A9F]">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-[#1E2D4A] bg-[#0A0E1A] p-4">
                  <LineChart
                    data={costPoints}
                    index="Q"
                    categories={['Total Cost', 'Ordering Cost', 'Holding Cost']}
                    colors={['emerald', 'blue', 'amber']}
                    className="h-44"
                    showLegend={false}
                    showGridLines={true}
                    curveType="monotone"
                    showAnimation={true}
                  />
                </div>
              </div>

              {/* Cost breakdown at Q* */}
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.12em] mb-3">
                  Annual Cost at Q*
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Ordering Cost', value: annualCost.orderingCost, color: 'text-blue-400', bar: 'bg-blue-500' },
                    { label: 'Holding Cost', value: annualCost.holdingCost, color: 'text-amber-400', bar: 'bg-amber-500' },
                    { label: 'Total Cost', value: annualCost.totalCost, color: 'text-emerald-400', bar: 'bg-emerald-500' },
                  ].map(({ label, value, color, bar }) => (
                    <div key={label} className="px-4 py-3.5 rounded-xl border border-[#1E2D4A] bg-[#0D1422]">
                      <p className={`text-[15px] font-bold font-mono tabular-nums ${color}`}>
                        ${Math.round(value).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-[#4B5563] uppercase tracking-[0.1em] mt-1">{label}</p>
                      <div className="mt-2.5 h-0.5 rounded-full bg-[#1A2035]">
                        <div
                          className={`h-full rounded-full ${bar}`}
                          style={{ width: `${Math.round((value / annualCost.totalCost) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ABC insight */}
              {abcItem && (
                <div className="rounded-xl border border-[#1E2D4A] bg-[#0D1422] px-5 py-4">
                  <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-2">ABC Analysis</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded border ${abcConfig[abcItem.class]}`}>
                        Class {abcItem.class}
                      </span>
                      <p className="text-[11px] text-[#94A3B8] mt-2">
                        {abcItem.class === 'A'
                          ? 'High value — requires close monitoring and frequent reordering.'
                          : abcItem.class === 'B'
                          ? 'Medium value — standard review cycle recommended.'
                          : 'Low value — periodic review sufficient.'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[20px] font-bold font-mono tabular-nums text-[#E2E8F0]">
                        {abcItem.valuePct.toFixed(1)}%
                      </p>
                      <p className="text-[9px] text-[#4B5563] uppercase tracking-[0.1em]">of total value</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-[#1A2035] overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, abcItem.cumulativePct)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#4B5563] mt-1">
                    Cumulative: <span className="text-[#6B7A9F] font-mono">{abcItem.cumulativePct.toFixed(1)}%</span> of portfolio value
                  </p>
                </div>
              )}

              <div className="h-4" />
            </div>
          </>
        )}
      </div>
    </>
  )
}
