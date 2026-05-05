'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@tremor/react'
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ShoppingCart,
  CheckCircle2,
  BarChart2,
} from 'lucide-react'
import { inventoryData, InventoryItem, StockStatus, TrendDirection } from '@/lib/data'
import { SKUDrawer } from '@/components/inventory/SKUDrawer'

type StatusFilter = 'all' | StockStatus
type SortField = 'product' | 'currentStock' | 'reorderPoint' | 'unitValue'
type SortDir = 'asc' | 'desc'

const statusConfig: Record<StockStatus, { label: string; wrap: string; dot: string }> = {
  optimal: { label: 'Optimal', wrap: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  low: { label: 'Low Stock', wrap: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  overstock: { label: 'Overstock', wrap: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', dot: 'bg-blue-400' },
}

const trendIcons: Record<TrendDirection, { Icon: typeof TrendingUp; color: string }> = {
  up: { Icon: TrendingUp, color: 'text-emerald-400' },
  down: { Icon: TrendingDown, color: 'text-red-400' },
  stable: { Icon: Minus, color: 'text-[#6B7A9F]' },
}

function SortButton({ field, current, dir, onSort }: {
  field: SortField
  current: SortField
  dir: SortDir
  onSort: (f: SortField) => void
}) {
  const isActive = current === field
  return (
    <button onClick={() => onSort(field)} className="inline-flex items-center gap-1 hover:text-[#E2E8F0] transition-colors">
      {isActive ? (
        dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronsUpDown className="w-3 h-3 opacity-40" />
      )}
    </button>
  )
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('product')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [reorderedIds, setReorderedIds] = useState<Set<number>>(new Set())
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(inventoryData.map((i) => i.category))).sort()],
    []
  )

  const stats = useMemo(() => {
    const totalValue = inventoryData.reduce((s, i) => s + i.currentStock * i.unitValue, 0)
    return {
      total: inventoryData.length,
      optimal: inventoryData.filter((i) => i.status === 'optimal').length,
      low: inventoryData.filter((i) => i.status === 'low').length,
      overstock: inventoryData.filter((i) => i.status === 'overstock').length,
      totalValue,
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return inventoryData
      .filter((item) => {
        const matchSearch =
          !q || item.product.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
        const matchStatus = statusFilter === 'all' || item.status === statusFilter
        const matchCat = categoryFilter === 'all' || item.category === categoryFilter
        return matchSearch && matchStatus && matchCat
      })
      .sort((a, b) => {
        const av = a[sortField]
        const bv = b[sortField]
        const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [search, statusFilter, categoryFilter, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function handleReorder(id: number) {
    setReorderedIds((prev) => new Set(prev).add(id))
  }

  const statusTabs: { value: StatusFilter; label: string; count: number; color: string }[] = [
    { value: 'all', label: 'All', count: stats.total, color: 'text-[#94A3B8]' },
    { value: 'optimal', label: 'Optimal', count: stats.optimal, color: 'text-emerald-400' },
    { value: 'low', label: 'Low Stock', count: stats.low, color: 'text-amber-400' },
    { value: 'overstock', label: 'Overstock', count: stats.overstock, color: 'text-blue-400' },
  ]

  return (
    <AppShell>
      <SKUDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
      {/* Header */}
      <div className="border-b border-[#1E2D4A] bg-[#070B14]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-bold text-[#E2E8F0] font-display tracking-tight">Inventory</h1>
            <p className="text-[11px] text-[#6B7A9F] mt-px">Stock management · {stats.total} SKUs</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-7 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total SKUs', value: stats.total, sub: 'across all categories', icon: Package, color: 'text-[#94A3B8]' },
            { label: 'Optimal', value: stats.optimal, sub: 'within safe range', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Low Stock', value: stats.low, sub: 'below reorder point', icon: AlertTriangle, color: 'text-amber-400' },
            { label: 'Inventory Value', value: `$${(stats.totalValue / 1000).toFixed(1)}K`, sub: 'at cost price', icon: Package, color: 'text-blue-400' },
          ].map(({ label, value, sub, icon: Icon, color }, i) => (
            <div
              key={label}
              className="px-4 py-3.5 rounded-xl border border-[#1E2D4A] bg-[#0D1422] animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <p className="text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em]">{label}</p>
              </div>
              <p className={`text-2xl font-bold font-mono tabular-nums ${color}`}>{value}</p>
              <p className="text-[10px] text-[#374151] mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or SKU..."
              className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#0D1422] border border-[#1E2D4A] rounded-lg text-[#94A3B8] placeholder-[#374151] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0A0E1A] border border-[#1E2D4A]">
            {statusTabs.map(({ value, label, count, color }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  statusFilter === value
                    ? 'bg-[#0D1422] border border-[#1E2D4A] text-[#E2E8F0]'
                    : 'text-[#4B5563] hover:text-[#6B7A9F]'
                }`}
              >
                {label}
                <span className={`text-[10px] font-mono ${statusFilter === value ? color : ''}`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-[13px] bg-[#0D1422] border border-[#1E2D4A] rounded-lg text-[#94A3B8] focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c}
              </option>
            ))}
          </select>

          <p className="text-[11px] text-[#4B5563] ml-auto">
            Showing <span className="text-[#6B7A9F] font-mono">{filtered.length}</span> of {stats.total} items
          </p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[#1E2D4A] overflow-hidden animate-slide-up" style={{ animationDelay: '240ms' }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { label: 'Product', field: 'product' as SortField },
                  { label: 'SKU' },
                  { label: 'Category' },
                  { label: 'Current Stock', field: 'currentStock' as SortField },
                  { label: 'Reorder Point', field: 'reorderPoint' as SortField },
                  { label: 'Unit Value', field: 'unitValue' as SortField },
                  { label: 'Lead Time' },
                  { label: 'Trend' },
                  { label: 'Status' },
                  { label: 'Action' },
                ].map(({ label, field }) => (
                  <TableHeaderCell
                    key={label}
                    className="!text-[10px] !uppercase !tracking-[0.14em] !font-bold !text-[#6B7A9F] !bg-[#080C14] !py-3.5 !border-b !border-[#1E2D4A]"
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      {field && (
                        <SortButton field={field} current={sortField} dir={sortDir} onSort={handleSort} />
                      )}
                    </span>
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item) => {
                const st = statusConfig[item.status]
                const tr = trendIcons[item.trend]
                const TrendIcon = tr.Icon
                const barWidth = Math.min(100, (item.currentStock / (item.reorderPoint * 3)) * 100)
                const isReordered = reorderedIds.has(item.id)

                return (
                  <TableRow
                    key={item.id}
                    className="!border-b !border-[#131929] hover:!bg-[#0D1726] transition-colors cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <TableCell className="!py-3.5">
                      <span className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-[#D1D9EE]">{item.product}</span>
                        <BarChart2 className="w-3 h-3 text-[#2A3A5C] group-hover:text-emerald-500/60 transition-colors flex-shrink-0" />
                      </span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <span className="text-[11px] font-mono text-[#6B7A9F] bg-[#0D1422] border border-[#1E2D4A] px-2 py-0.5 rounded">
                        {item.sku}
                      </span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <span className="text-xs text-[#94A3B8]">{item.category}</span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-mono font-semibold text-[#E2E8F0] tabular-nums w-12 text-right">
                          {item.currentStock.toLocaleString()}
                        </span>
                        <div className="w-14 h-1 rounded-full bg-[#1A2035] overflow-hidden flex-shrink-0">
                          <div
                            className={`h-full rounded-full ${
                              item.status === 'low' ? 'bg-amber-500' : item.status === 'overstock' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <span className="text-[13px] font-mono text-[#6B7A9F] tabular-nums">{item.reorderPoint}</span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <span className="text-[13px] font-mono text-[#94A3B8] tabular-nums">${item.unitValue.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <span className="text-[12px] font-mono text-[#6B7A9F]">{item.leadTimeDays}d</span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <TrendIcon className={`w-4 h-4 ${tr.color}`} />
                    </TableCell>
                    <TableCell className="!py-3.5">
                      <span className={`status-badge ${st.wrap}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                        {st.label}
                      </span>
                    </TableCell>
                    <TableCell className="!py-3.5">
                      {item.status === 'low' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReorder(item.id) }}
                          disabled={isReordered}
                          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all ${
                            isReordered
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                        >
                          {isReordered ? (
                            <><CheckCircle2 className="w-3 h-3" /> Ordered</>
                          ) : (
                            <><ShoppingCart className="w-3 h-3" /> Reorder</>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#2A3A5C]">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="!py-12 !text-center !text-[#4B5563]" colSpan={10}>
                    No items match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  )
}
