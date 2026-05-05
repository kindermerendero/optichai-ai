export type StockStatus = 'optimal' | 'low' | 'overstock'
export type TrendDirection = 'up' | 'down' | 'stable'

export interface InventoryItem {
  id: number
  product: string
  sku: string
  category: string
  currentStock: number
  reorderPoint: number
  unitValue: number
  annualDemand: number
  leadTimeDays: number
  status: StockStatus
  trend: TrendDirection
}

export const inventoryData: InventoryItem[] = [
  {
    id: 1,
    product: 'Industrial Bearing A-7',
    sku: 'IND-BRG-A7',
    category: 'Mechanical',
    currentStock: 245,
    reorderPoint: 100,
    unitValue: 38.5,
    annualDemand: 1200,
    leadTimeDays: 7,
    status: 'optimal',
    trend: 'stable',
  },
  {
    id: 2,
    product: 'Hydraulic Pump Seal Kit',
    sku: 'HYD-PSK-01',
    category: 'Hydraulic',
    currentStock: 32,
    reorderPoint: 50,
    unitValue: 124.0,
    annualDemand: 480,
    leadTimeDays: 14,
    status: 'low',
    trend: 'down',
  },
  {
    id: 3,
    product: 'Steel Rod 12mm Grade B',
    sku: 'STL-ROD-12B',
    category: 'Raw Material',
    currentStock: 1840,
    reorderPoint: 500,
    unitValue: 4.2,
    annualDemand: 6000,
    leadTimeDays: 3,
    status: 'overstock',
    trend: 'up',
  },
  {
    id: 4,
    product: 'Circuit Board Module X',
    sku: 'CBM-X-001',
    category: 'Electronics',
    currentStock: 18,
    reorderPoint: 25,
    unitValue: 218.75,
    annualDemand: 300,
    leadTimeDays: 21,
    status: 'low',
    trend: 'down',
  },
  {
    id: 5,
    product: 'Pneumatic Valve Type C',
    sku: 'PNM-VLV-C',
    category: 'Pneumatic',
    currentStock: 67,
    reorderPoint: 30,
    unitValue: 89.0,
    annualDemand: 720,
    leadTimeDays: 5,
    status: 'optimal',
    trend: 'stable',
  },
  {
    id: 6,
    product: 'Rubber Gasket Set Pro',
    sku: 'RBR-GSK-PRO',
    category: 'Seals',
    currentStock: 520,
    reorderPoint: 200,
    unitValue: 12.3,
    annualDemand: 1800,
    leadTimeDays: 4,
    status: 'overstock',
    trend: 'up',
  },
  {
    id: 7,
    product: 'LED Driver 48V 5A',
    sku: 'LED-DRV-485',
    category: 'Electronics',
    currentStock: 8,
    reorderPoint: 20,
    unitValue: 156.0,
    annualDemand: 240,
    leadTimeDays: 18,
    status: 'low',
    trend: 'down',
  },
  {
    id: 8,
    product: 'Aluminum Extrusion T5',
    sku: 'ALM-EXT-T5',
    category: 'Raw Material',
    currentStock: 156,
    reorderPoint: 80,
    unitValue: 22.8,
    annualDemand: 2400,
    leadTimeDays: 5,
    status: 'optimal',
    trend: 'stable',
  },
  {
    id: 9,
    product: 'Servo Motor 24V DC',
    sku: 'SRV-MOT-24V',
    category: 'Electronics',
    currentStock: 11,
    reorderPoint: 15,
    unitValue: 342.0,
    annualDemand: 180,
    leadTimeDays: 30,
    status: 'low',
    trend: 'down',
  },
  {
    id: 10,
    product: 'Conveyor Belt 50mm',
    sku: 'CNV-BLT-50',
    category: 'Mechanical',
    currentStock: 88,
    reorderPoint: 40,
    unitValue: 67.5,
    annualDemand: 960,
    leadTimeDays: 7,
    status: 'optimal',
    trend: 'stable',
  },
  {
    id: 11,
    product: 'Safety Relay Module',
    sku: 'SFT-RLY-MOD',
    category: 'Electronics',
    currentStock: 340,
    reorderPoint: 80,
    unitValue: 98.0,
    annualDemand: 360,
    leadTimeDays: 10,
    status: 'overstock',
    trend: 'up',
  },
  {
    id: 12,
    product: 'Carbon Steel Pipe 2"',
    sku: 'CSP-2IN-SCH40',
    category: 'Raw Material',
    currentStock: 210,
    reorderPoint: 100,
    unitValue: 31.4,
    annualDemand: 3600,
    leadTimeDays: 6,
    status: 'optimal',
    trend: 'stable',
  },
]

export interface MonthlyDemand {
  month: string
  Historical: number | null
  Forecast: number
}

export const demandHistory: MonthlyDemand[] = [
  { month: 'Jan 24', Historical: 1240, Forecast: 1200 },
  { month: 'Feb 24', Historical: 1180, Forecast: 1190 },
  { month: 'Mar 24', Historical: 1420, Forecast: 1350 },
  { month: 'Apr 24', Historical: 1350, Forecast: 1380 },
  { month: 'May 24', Historical: 1580, Forecast: 1500 },
  { month: 'Jun 24', Historical: 1690, Forecast: 1640 },
  { month: 'Jul 24', Historical: 1520, Forecast: 1560 },
  { month: 'Aug 24', Historical: 1380, Forecast: 1420 },
  { month: 'Sep 24', Historical: 1620, Forecast: 1580 },
  { month: 'Oct 24', Historical: 1890, Forecast: 1820 },
  { month: 'Nov 24', Historical: 2100, Forecast: 2050 },
  { month: 'Dec 24', Historical: 1950, Forecast: 2000 },
  { month: 'Jan 25', Historical: null, Forecast: 1820 },
  { month: 'Feb 25', Historical: null, Forecast: 1880 },
  { month: 'Mar 25', Historical: null, Forecast: 2140 },
]
