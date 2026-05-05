# OptiChain AI

**Enterprise Supply Chain Optimization Dashboard**

A production-grade operations management dashboard built to minimize inventory costs, reduce stockouts, and surface actionable insights through demand forecasting and algorithmic optimization.

---

## Features

**Dashboard**
- 4 real-time KPI cards: Inventory Value, Out-of-Stock Risk, Turnover Ratio, Potential Savings
- Inventory overview table with stock levels, reorder thresholds, and status classification
- CSV data import with visual feedback

**Inventory Management**
- Full-text search across product names and SKUs
- Filter by status (Optimal / Low Stock / Overstock) and category
- Sortable columns: product name, current stock, reorder point, unit value
- One-click reorder trigger for items below the reorder threshold

**Forecasting & Optimization**
- 12-month demand chart with 3-month AI projection (Tremor AreaChart)
- Interactive EOQ Calculator using the Wilson formula
- Safety stock calculation at 95% service level
- ABC Classification with Pareto analysis and value distribution chart

**Settings**
- Company profile and warehouse configuration
- Configurable reorder thresholds (safety stock %, low/overstock multipliers)
- Granular notification preferences
- Integration cards: SAP S/4HANA, Oracle NetSuite, CSV, Webhook API

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 |
| Charts & UI | Tremor 3.18 |
| Icons | Lucide React |
| Typography | Syne · DM Sans · JetBrains Mono |

---

## Algorithms

### Economic Order Quantity (EOQ) — Wilson Model

Finds the lot size Q* that minimises the sum of annual ordering and holding costs:

```
Q* = sqrt(2 × D × S / H)
```

| Variable | Description |
|----------|-------------|
| D | Annual demand (units/year) |
| S | Fixed cost per order ($) |
| H | Annual holding cost per unit ($/unit/year) |

**Reorder Point with Safety Stock:**
```
ROP = (D / 365) × Lead Time + Safety Stock
Safety Stock = z × σ_d × sqrt(Lead Time)    [z = 1.65 at 95% service level]
```

### ABC Classification — Pareto Analysis

Items are ranked by annual spend value (unit cost × annual demand) and segmented:

| Class | Cumulative Value | Typical % of SKUs | Control Level |
|-------|-----------------|-------------------|---------------|
| A | 0 – 80% | ~20% | Tight — frequent review |
| B | 80 – 95% | ~30% | Moderate |
| C | 95 – 100% | ~50% | Minimal oversight |

---

## Getting Started

```bash
git clone https://github.com/<your-username>/optichai-ai
cd optichai-ai
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/dashboard` automatically.

**Build for production:**
```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  dashboard/        KPI cards, inventory overview, CSV upload
  inventory/        Interactive stock management with filters and sort
  forecasting/      Demand chart, EOQ optimizer, ABC classification
  settings/         Company profile, thresholds, notifications, integrations
  layout.tsx        Root layout — font config, dark class
  globals.css       Tailwind base, Tremor dark overrides, custom scrollbar

components/
  layout/
    Sidebar.tsx     Fixed nav sidebar with active-state routing
    AppShell.tsx    Page wrapper: sidebar + main content
  dashboard/
    KPICard.tsx     Animated KPI card with accent color variants
    InventoryTable.tsx  Tremor Table with status badges and mini stock bars
    UploadButton.tsx    CSV file input with confirmation feedback

lib/
  data.ts           Inventory data model and 12-SKU mock dataset
  eoq.ts            EOQ, safety stock, ROP, and ABC analysis functions
  utils.ts          cn() helper (clsx + tailwind-merge)
```

---

## Design System

- **Background:** `#070B14` (deep navy-black)
- **Surface:** `#0D1422` (card background)
- **Border:** `#1E2D4A`
- **Primary accent:** Emerald `#10b981`
- **Secondary:** Blue `#3B82F6`, Amber `#F59E0B`, Violet `#8B5CF6`
- **Status:** Emerald = Optimal · Amber = Low Stock · Blue = Overstock

---

## License

MIT © 2025 Massimo Merenda
