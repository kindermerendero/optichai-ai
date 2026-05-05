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
