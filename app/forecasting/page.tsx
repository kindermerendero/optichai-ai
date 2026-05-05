'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AreaChart, DonutChart } from '@tremor/react'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@tremor/react'
import { TrendingUp, Zap, BarChart3, Calculator } from 'lucide-react'
import { inventoryData, demandHistory } from '@/lib/data'
import {
  calculateEOQ,
  calculateReorderPoint,
  calculateSafetyStock,
  calculateAnnualCost,
  performABCAnalysis,
  ABCClass,
} from '@/lib/eoq'

const abcColors: Record<ABCClass, { wrap: string; dot: string; badge: string }> = {
  A: { wrap: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400', badge: 'A' },
  B: { wrap: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', dot: 'bg-blue-400', badge: 'B' },
  C: { wrap: 'bg-[#1E2D4A] text-[#6B7A9F] border border-[#2A3A5C]', dot: 'bg-[#6B7A9F]', badge: 'C' },
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof TrendingUp; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <Icon className="w-4 h-4 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-[13px] font-bold text-[#E2E8F0] font-display tracking-tight">{title}</h2>
        <p className="text-[11px] text-[#6B7A9F]">{subtitle}</p>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, min, max, step = 1, unit }: {
  label: string; value: number; onChange: (v: number) => void
  min?: number; max?: number; step?: number; unit?: string
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 pr-10 text-[13px] font-mono bg-[#0A0E1A] border border-[#1E2D4A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#4B5563] font-mono">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ForecastingPage() {
  const [D, setD] = useState(1200)
  const [S, setS] = useState(50)
  const [H, setH] = useState(8)
  const [leadTime, setLeadTime] = useState(7)
  const [dailyStdDev, setDailyStdDev] = useState(12)

  const eoq = useMemo(() => calculateEOQ(D, S, H), [D, S, H])
  const safetyStock = useMemo(() => calculateSafetyStock(dailyStdDev, leadTime), [dailyStdDev, leadTime])
  const rop = useMemo(() => calculateReorderPoint(D, leadTime, safetyStock), [D, leadTime, safetyStock])
  const costs = useMemo(() => calculateAnnualCost(D, eoq, S, H), [D, eoq, S, H])
  const ordersPerYear = useMemo(() => (eoq > 0 ? D / eoq : 0), [D, eoq])

  const abcResults = useMemo(
    () =>
      performABCAnalysis(
        inventoryData.map((i) => ({
          id: i.id,
          product: i.product,
          sku: i.sku,
          annualDemand: i.annualDemand,
          unitValue: i.unitValue,
        }))
      ),
    []
  )

  const donutData = useMemo(() => {
    const grouped = { A: 0, B: 0, C: 0 }
    abcResults.forEach((r) => { grouped[r.class] += r.annualValue })
    return [
      { name: 'Class A — High Value', value: grouped.A },
      { name: 'Class B — Medium Value', value: grouped.B },
      { name: 'Class C — Low Value', value: grouped.C },
    ]
  }, [abcResults])

  const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n))

  return (
    <AppShell>
      <div className="border-b border-[#1E2D4A] bg-[#070B14]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-8 h-16 flex items-center">
          <div>
            <h1 className="text-[15px] font-bold text-[#E2E8F0] font-display tracking-tight">Forecasting</h1>
            <p className="text-[11px] text-[#6B7A9F] mt-px">Demand prediction · EOQ optimization · ABC classification</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-7 space-y-10">

        {/* ── DEMAND CHART ─────────────────────────────────────── */}
        <section>
          <SectionHeader icon={TrendingUp} title="Demand Forecast — Jan 24 → Mar 25" subtitle="12-month historical demand with 3-month AI projection" />
          <div className="rounded-xl border border-[#1E2D4A] bg-[#0D1422] p-5 animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-[11px] text-[#6B7A9F]">
                <span className="w-3 h-0.5 bg-emerald-500 rounded" /> Historical
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#6B7A9F]">
                <span className="w-3 h-0.5 bg-blue-500 rounded" /> AI Forecast
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Zap className="w-3 h-3" />
                Forecast accuracy 94.2% MAPE
              </div>
            </div>
            <AreaChart
              data={demandHistory}
              index="month"
              categories={['Historical', 'Forecast']}
              colors={['emerald', 'blue']}
              valueFormatter={(v) => (v ? `${v.toLocaleString()} units` : '—')}
              showAnimation
              className="h-60"
            />
            <div className="mt-3 pt-3 border-t border-[#1A2035] flex items-center gap-6">
              <div>
                <p className="text-[10px] text-[#4B5563] uppercase tracking-[0.1em]">Jan–Dec 24 Total</p>
                <p className="text-[13px] font-mono font-semibold text-[#94A3B8] mt-0.5">
                  {demandHistory.filter(d => d.Historical).reduce((s, d) => s + (d.Historical ?? 0), 0).toLocaleString()} units
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#4B5563] uppercase tracking-[0.1em]">Q1 25 Projection</p>
                <p className="text-[13px] font-mono font-semibold text-blue-400 mt-0.5">
                  {demandHistory.filter(d => !d.Historical).reduce((s, d) => s + d.Forecast, 0).toLocaleString()} units
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#4B5563] uppercase tracking-[0.1em]">YoY Growth</p>
                <p className="text-[13px] font-mono font-semibold text-emerald-400 mt-0.5">+12.4%</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── EOQ OPTIMIZER ────────────────────────────────────── */}
        <section>
          <SectionHeader icon={Calculator} title="EOQ Optimizer — Wilson Model" subtitle="Find the optimal order quantity that minimises total annual cost" />
          <div className="grid grid-cols-5 gap-4 animate-slide-up" style={{ animationDelay: '80ms' }}>

            {/* Inputs */}
            <div className="col-span-2 rounded-xl border border-[#1E2D4A] bg-[#0D1422] p-5 space-y-4">
              <div className="mb-2">
                <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-2">Formula</p>
                <div className="px-4 py-3 rounded-lg bg-[#0A0E1A] border border-[#1A2035] font-mono text-center">
                  <span className="text-[#94A3B8] text-sm">Q* = </span>
                  <span className="text-emerald-400 text-base font-bold">√</span>
                  <span className="text-white text-sm font-semibold">(2 × D × S / H)</span>
                </div>
                <div className="flex gap-4 mt-2 text-[10px] text-[#4B5563] font-mono">
                  <span><span className="text-[#6B7A9F]">D</span> = Annual demand</span>
                  <span><span className="text-[#6B7A9F]">S</span> = Order cost</span>
                  <span><span className="text-[#6B7A9F]">H</span> = Holding cost/unit/yr</span>
                </div>
              </div>

              <InputField label="Annual Demand (D)" value={D} onChange={setD} min={1} unit="units/yr" />
              <InputField label="Ordering Cost (S)" value={S} onChange={setS} min={1} step={5} unit="$/order" />
              <InputField label="Holding Cost (H)" value={H} onChange={setH} min={0.1} step={0.5} unit="$/unit/yr" />
              <InputField label="Lead Time" value={leadTime} onChange={setLeadTime} min={1} unit="days" />
              <InputField label="Daily Demand Std Dev" value={dailyStdDev} onChange={setDailyStdDev} min={0} unit="units" />
            </div>

            {/* Results */}
            <div className="col-span-3 rounded-xl border border-[#1E2D4A] bg-[#0D1422] p-5">
              <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-4">Optimal Parameters</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Optimal Order Qty (Q*)', value: `${fmt(eoq)} units`, color: 'text-emerald-400', accent: 'border-emerald-500/30' },
                  { label: 'Orders per Year', value: `${ordersPerYear.toFixed(1)}x`, color: 'text-blue-400', accent: 'border-blue-500/30' },
                  { label: 'Reorder Point (ROP)', value: `${fmt(rop)} units`, color: 'text-amber-400', accent: 'border-amber-500/30' },
                  { label: 'Safety Stock', value: `${fmt(safetyStock)} units`, color: 'text-violet-400', accent: 'border-violet-500/30' },
                ].map(({ label, value, color, accent }) => (
                  <div key={label} className={`p-3 rounded-lg border ${accent} bg-[#080C14]`}>
                    <p className="text-[10px] text-[#4B5563] uppercase tracking-[0.1em]">{label}</p>
                    <p className={`text-xl font-bold font-mono tabular-nums mt-1 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-3">Annual Cost Breakdown</p>
              <div className="space-y-2">
                {[
                  { label: 'Ordering Cost', value: costs.orderingCost, color: 'bg-blue-500' },
                  { label: 'Holding Cost', value: costs.holdingCost, color: 'bg-amber-500' },
                  { label: 'Total Annual Cost', value: costs.totalCost, color: 'bg-emerald-500', bold: true },
                ].map(({ label, value, color, bold }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className={`text-[11px] w-36 ${bold ? 'font-semibold text-[#E2E8F0]' : 'text-[#6B7A9F]'}`}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#1A2035] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-300`}
                        style={{ width: `${Math.min(100, (value / (costs.totalCost || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-[12px] font-mono tabular-nums w-20 text-right ${bold ? 'font-semibold text-emerald-400' : 'text-[#94A3B8]'}`}>
                      ${fmt(value)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#1A2035] text-[11px] text-[#4B5563]">
                95% service level (z=1.65) · Daily demand distributed normally
              </div>
            </div>
          </div>
        </section>

        {/* ── ABC ANALYSIS ─────────────────────────────────────── */}
        <section>
          <SectionHeader icon={BarChart3} title="ABC Classification — Pareto Analysis" subtitle="Rank inventory by annual spend to guide procurement priorities" />
          <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '160ms' }}>

            {/* Donut + legend */}
            <div className="rounded-xl border border-[#1E2D4A] bg-[#0D1422] p-5">
              <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-4">Value Distribution</p>
              <DonutChart
                data={donutData}
                category="value"
                index="name"
                colors={['emerald', 'blue', 'slate']}
                valueFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
                className="h-44"
                showAnimation
              />
              <div className="mt-4 space-y-2">
                {[
                  { cls: 'A', label: 'Class A — 80% value', color: 'bg-emerald-500' },
                  { cls: 'B', label: 'Class B — 15% value', color: 'bg-blue-500' },
                  { cls: 'C', label: 'Class C — 5% value', color: 'bg-slate-600' },
                ].map(({ cls, label, color }) => (
                  <div key={cls} className="flex items-center gap-2 text-[11px] text-[#6B7A9F]">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="col-span-2 rounded-xl border border-[#1E2D4A] overflow-hidden">
              <Table>
                <TableHead>
                  <TableRow>
                    {['Rank', 'Product', 'SKU', 'Annual Value', 'Item %', 'Cumulative %', 'Class'].map((h) => (
                      <TableHeaderCell key={h} className="!text-[10px] !uppercase !tracking-[0.12em] !font-bold !text-[#6B7A9F] !bg-[#080C14] !py-3 !border-b !border-[#1E2D4A]">
                        {h}
                      </TableHeaderCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {abcResults.map((item, i) => {
                    const c = abcColors[item.class]
                    return (
                      <TableRow key={item.id} className="!border-b !border-[#131929] hover:!bg-[#0D1726] transition-colors">
                        <TableCell className="!py-3">
                          <span className="text-[11px] font-mono text-[#4B5563] w-6 text-center block">#{i + 1}</span>
                        </TableCell>
                        <TableCell className="!py-3">
                          <span className="text-[12px] font-medium text-[#D1D9EE]">{item.product}</span>
                        </TableCell>
                        <TableCell className="!py-3">
                          <span className="text-[11px] font-mono text-[#4B5563]">{item.sku}</span>
                        </TableCell>
                        <TableCell className="!py-3">
                          <span className="text-[12px] font-mono font-semibold text-[#94A3B8] tabular-nums">
                            ${(item.annualValue / 1000).toFixed(1)}K
                          </span>
                        </TableCell>
                        <TableCell className="!py-3">
                          <span className="text-[11px] font-mono text-[#6B7A9F]">{item.valuePct.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell className="!py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 rounded-full bg-[#1A2035]">
                              <div
                                className={`h-full rounded-full ${item.class === 'A' ? 'bg-emerald-500' : item.class === 'B' ? 'bg-blue-500' : 'bg-slate-600'}`}
                                style={{ width: `${Math.min(100, item.cumulativePct)}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-[#6B7A9F]">{item.cumulativePct.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="!py-3">
                          <span className={`status-badge ${c.wrap}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                            {item.class}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
