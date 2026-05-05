# Changelog — OptiChain AI

## [2026-05-05] — Step 2/3/4: Inventory, Forecasting, Settings + README

### Aggiunto
- **Inventory** (`app/inventory/page.tsx`): client component con search, filtri (status + category), sort multi-colonna, mini stock bar, bottone "Reorder Now" per low-stock items
- **Forecasting** (`app/forecasting/page.tsx`): tre sezioni — demand chart 15 mesi (Tremor AreaChart), EOQ calculator interattivo (formula Wilson, safety stock z=1.65, cost breakdown), ABC Classification con Pareto (Tremor DonutChart + tabella ranked)
- **Settings** (`app/settings/page.tsx`): company profile, reorder thresholds, toggle notifications (5 configurabili), integration cards (SAP/Oracle/CSV/Webhook)
- `lib/data.ts`: espanso da 8 a 12 SKU, aggiunti campi `annualDemand` e `leadTimeDays`, array `demandHistory` 15 mesi
- `lib/eoq.ts`: funzioni `calculateEOQ`, `calculateReorderPoint`, `calculateSafetyStock`, `calculateAnnualCost`, `performABCAnalysis`
- `README.md`: readme professionale con feature list, tech stack table, sezione algoritmi (EOQ + ABC), project structure
- `.gitignore`: standard Next.js

### Decisioni
- Tremor AreaChart/DonutChart richiede `'use client'` — forecasting page è client component
- ABC analysis usa `annualDemand × unitValue` come proxy del valore annuo (approccio standard)
- Safety stock calcolato a z=1.65 (95% service level), non configurabile nell'UI in questo step

## [2026-05-04] — Step 1: Dashboard foundation

### Aggiunto
- Scaffolding completo Next.js 14 App Router + TypeScript
- Layout principale: sidebar fissa 240px + AppShell
- 4 KPI Cards (Inventory Value, Out-of-Stock Risk, Turnover Ratio, Potential Savings)
  con animazioni `slide-up` staggered e accent color per variante
- Tabella Inventory Overview con Tremor Table, mini stock bar, status badges
- Pulsante "Upload Supply Chain Data" con input CSV simulato e feedback visivo
- Pagine placeholder per Inventory, Forecasting, Settings
- Tema dark navy/emerald fisso: `#070B14` bg, accento emerald, font Syne + JetBrains Mono

### Decisioni architetturali
- Dark mode hardcodata via `className="dark"` su `<html>` — nessun toggle per ora
- Tremor usato per Table/TableRow per consistenza futura con grafici (Step 3)
- Dati mock in `lib/data.ts`, nessuna fetch esterna in Step 1
- `@tremor/react` pinned a ^3.18.3 per compatibilità Tailwind v3
