import type { InventoryItem } from './data'

const ORDERING_COST = 40 // $ per order, fixed assumption

export function getHoldingCostRate(unitValue: number): number {
  return unitValue * 0.25
}

export interface StockPoint {
  month: string
  'Stock Level': number
  'Reorder Point': number
}

export interface CostPoint {
  Q: string
  'Ordering Cost': number
  'Holding Cost': number
  'Total Cost': number
}

function seededRand(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function generateStockHistory(item: InventoryItem): StockPoint[] {
  const H = getHoldingCostRate(item.unitValue)
  const eoqQty = Math.max(1, Math.round(Math.sqrt((2 * item.annualDemand * ORDERING_COST) / H)))
  const monthlyDemand = item.annualDemand / 12
  let stock = Math.max(item.currentStock, item.reorderPoint * 2 + eoqQty)
  const result: StockPoint[] = []
  for (let i = 0; i < 12; i++) {
    const variance = 0.82 + seededRand(item.id, i) * 0.36
    stock -= monthlyDemand * variance
    if (stock <= item.reorderPoint) stock += eoqQty
    result.push({
      month: MONTHS[i],
      'Stock Level': Math.round(Math.max(0, stock)),
      'Reorder Point': item.reorderPoint,
    })
  }
  return result
}

export function generateEOQCurve(item: InventoryItem): { points: CostPoint[]; eoq: number } {
  const H = getHoldingCostRate(item.unitValue)
  const eoq = Math.max(1, Math.round(Math.sqrt((2 * item.annualDemand * ORDERING_COST) / H)))
  const minQ = Math.max(1, Math.round(eoq * 0.2))
  const maxQ = Math.round(eoq * 3.5)
  const step = Math.max(1, Math.round((maxQ - minQ) / 10))
  const points: CostPoint[] = []
  for (let q = minQ; q <= maxQ; q += step) {
    const orderingCost = (item.annualDemand / q) * ORDERING_COST
    const holdingCost = (q / 2) * H
    points.push({
      Q: String(q),
      'Ordering Cost': Math.round(orderingCost),
      'Holding Cost': Math.round(holdingCost),
      'Total Cost': Math.round(orderingCost + holdingCost),
    })
  }
  return { points, eoq }
}

/**
 * Economic Order Quantity (EOQ) model — Wilson formula
 * Q* = sqrt(2DS / H)
 */
export function calculateEOQ(D: number, S: number, H: number): number {
  if (D <= 0 || S <= 0 || H <= 0) return 0
  return Math.sqrt((2 * D * S) / H)
}

export function calculateReorderPoint(
  annualDemand: number,
  leadTimeDays: number,
  safetyStock: number
): number {
  const dailyDemand = annualDemand / 365
  return Math.ceil(dailyDemand * leadTimeDays + safetyStock)
}

export function calculateSafetyStock(
  dailyDemandStdDev: number,
  leadTimeDays: number,
  zScore = 1.65
): number {
  return Math.ceil(zScore * dailyDemandStdDev * Math.sqrt(leadTimeDays))
}

export interface EOQCosts {
  orderingCost: number
  holdingCost: number
  totalCost: number
}

export function calculateAnnualCost(D: number, Q: number, S: number, H: number): EOQCosts {
  if (Q <= 0) return { orderingCost: 0, holdingCost: 0, totalCost: 0 }
  const orderingCost = (D / Q) * S
  const holdingCost = (Q / 2) * H
  return { orderingCost, holdingCost, totalCost: orderingCost + holdingCost }
}

export type ABCClass = 'A' | 'B' | 'C'

export interface ABCResult {
  id: number
  product: string
  sku: string
  annualValue: number
  valuePct: number
  cumulativePct: number
  class: ABCClass
}

export function performABCAnalysis(
  items: { id: number; product: string; sku: string; annualDemand: number; unitValue: number }[]
): ABCResult[] {
  const withValue = items
    .map((item) => ({
      ...item,
      annualValue: item.annualDemand * item.unitValue,
    }))
    .sort((a, b) => b.annualValue - a.annualValue)

  const grandTotal = withValue.reduce((sum, i) => sum + i.annualValue, 0)
  let cumulative = 0

  return withValue.map(({ id, product, sku, annualValue }) => {
    cumulative += annualValue
    const valuePct = (annualValue / grandTotal) * 100
    const cumulativePct = (cumulative / grandTotal) * 100
    return {
      id,
      product,
      sku,
      annualValue,
      valuePct,
      cumulativePct,
      class: cumulativePct <= 80 ? 'A' : cumulativePct <= 95 ? 'B' : 'C',
    }
  })
}
