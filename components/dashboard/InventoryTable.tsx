import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@tremor/react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { inventoryData, StockStatus, TrendDirection } from '@/lib/data'

const statusConfig: Record<StockStatus, {
  label: string
  wrap: string
  dot: string
}> = {
  optimal: {
    label: 'Optimal',
    wrap: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  low: {
    label: 'Low Stock',
    wrap: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    dot: 'bg-amber-400',
  },
  overstock: {
    label: 'Overstock',
    wrap: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot: 'bg-blue-400',
  },
}

const trendConfig: Record<TrendDirection, {
  Icon: typeof TrendingUp
  color: string
}> = {
  up: { Icon: TrendingUp, color: 'text-emerald-400' },
  down: { Icon: TrendingDown, color: 'text-red-400' },
  stable: { Icon: Minus, color: 'text-[#6B7A9F]' },
}

const stockBarColor: Record<StockStatus, string> = {
  optimal: 'bg-emerald-500',
  low: 'bg-amber-500',
  overstock: 'bg-blue-500',
}

export function InventoryTable() {
  return (
    <div
      className="rounded-xl border border-[#1E2D4A] overflow-hidden animate-slide-up"
      style={{ animationDelay: '480ms' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {[
              'Product',
              'SKU',
              'Category',
              'Current Stock',
              'Reorder Point',
              'Unit Value',
              'Trend',
              'Status',
            ].map((h) => (
              <TableHeaderCell
                key={h}
                className="!text-[10px] !uppercase !tracking-[0.14em] !font-bold !text-[#6B7A9F] !bg-[#080C14] !py-3.5 !border-b !border-[#1E2D4A]"
              >
                {h}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {inventoryData.map((item) => {
            const st = statusConfig[item.status]
            const tr = trendConfig[item.trend]
            const TrendIcon = tr.Icon
            const barWidth = Math.min(100, (item.currentStock / (item.reorderPoint * 3)) * 100)

            return (
              <TableRow
                key={item.id}
                className="!border-b !border-[#131929] hover:!bg-[#0D1726] transition-colors"
              >
                {/* Product name */}
                <TableCell className="!py-3.5">
                  <span className="text-[13px] font-semibold text-[#D1D9EE]">
                    {item.product}
                  </span>
                </TableCell>

                {/* SKU */}
                <TableCell className="!py-3.5">
                  <span className="text-[11px] font-mono text-[#6B7A9F] bg-[#0D1422] border border-[#1E2D4A] px-2 py-0.5 rounded">
                    {item.sku}
                  </span>
                </TableCell>

                {/* Category */}
                <TableCell className="!py-3.5">
                  <span className="text-xs text-[#94A3B8]">{item.category}</span>
                </TableCell>

                {/* Current stock with mini bar */}
                <TableCell className="!py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-mono font-semibold text-[#E2E8F0] tabular-nums w-12 text-right">
                      {item.currentStock.toLocaleString()}
                    </span>
                    <div className="w-16 h-1 rounded-full bg-[#1A2035] overflow-hidden flex-shrink-0">
                      <div
                        className={`h-full rounded-full ${stockBarColor[item.status]} transition-all`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Reorder point */}
                <TableCell className="!py-3.5">
                  <span className="text-[13px] font-mono text-[#6B7A9F] tabular-nums">
                    {item.reorderPoint}
                  </span>
                </TableCell>

                {/* Unit value */}
                <TableCell className="!py-3.5">
                  <span className="text-[13px] font-mono text-[#94A3B8] tabular-nums">
                    ${item.unitValue.toFixed(2)}
                  </span>
                </TableCell>

                {/* Trend */}
                <TableCell className="!py-3.5">
                  <TrendIcon className={`w-4 h-4 ${tr.color}`} />
                </TableCell>

                {/* Status badge */}
                <TableCell className="!py-3.5">
                  <span className={`status-badge ${st.wrap}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                    {st.label}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
