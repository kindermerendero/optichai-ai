'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Building2, Bell, Plug, Sliders, CheckCircle2 } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        checked ? 'bg-emerald-500' : 'bg-[#1E2D4A]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function SectionCard({ icon: Icon, title, children }: {
  icon: typeof Building2; title: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[#1E2D4A] bg-[#0D1422] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1A2035]">
        <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <Icon className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <h2 className="text-[13px] font-bold text-[#E2E8F0] font-display">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, defaultValue, type = 'text', placeholder }: {
  label: string; defaultValue?: string; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#6B7A9F] uppercase tracking-[0.12em] mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-[13px] bg-[#0A0E1A] border border-[#1E2D4A] rounded-lg text-[#94A3B8] placeholder-[#374151] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
      />
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex-1">
        <p className="text-[13px] font-medium text-[#94A3B8]">{label}</p>
        <p className="text-[11px] text-[#4B5563] mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

const integrations = [
  {
    name: 'SAP S/4HANA',
    description: 'Sync purchase orders, goods receipts, and material master data',
    status: 'available' as const,
    icon: '⬡',
  },
  {
    name: 'Oracle NetSuite',
    description: 'Real-time inventory sync and financial reconciliation',
    status: 'available' as const,
    icon: '◈',
  },
  {
    name: 'CSV / Excel',
    description: 'Bulk import inventory data from flat files — manual or scheduled',
    status: 'connected' as const,
    icon: '⊞',
  },
  {
    name: 'Webhook API',
    description: 'Push reorder alerts and threshold breaches to any HTTP endpoint',
    status: 'available' as const,
    icon: '⟡',
  },
]

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    overstock: false,
    forecastDeviation: true,
    weeklyDigest: true,
    eopAlerts: false,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AppShell>
      <div className="border-b border-[#1E2D4A] bg-[#070B14]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-bold text-[#E2E8F0] font-display tracking-tight">Settings</h1>
            <p className="text-[11px] text-[#6B7A9F] mt-px">Platform configuration · integrations · preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              saved
                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white'
            }`}
          >
            {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</> : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="px-8 py-7 space-y-5 max-w-3xl">

        {/* Company Profile */}
        <SectionCard icon={Building2} title="Company Profile">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company Name" defaultValue="Massimo Merenda Industries" />
            <Field label="Industry" defaultValue="Manufacturing" />
            <Field label="Primary Warehouse" defaultValue="Milan — Warehouse A1" />
            <Field label="Fiscal Year Start" defaultValue="January" />
          </div>
          <Field label="ERP System" defaultValue="SAP S/4HANA (2023)" placeholder="e.g. SAP, Oracle, custom" />
        </SectionCard>

        {/* Reorder Thresholds */}
        <SectionCard icon={Sliders} title="Reorder Thresholds">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Default Safety Stock %" defaultValue="15" type="number" />
            <Field label="Low Stock Threshold %" defaultValue="100" type="number" />
            <Field label="Overstock Threshold %" defaultValue="300" type="number" />
            <Field label="Default Lead Time (days)" defaultValue="7" type="number" />
          </div>
          <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#1A2035]">
            <p className="text-[11px] text-[#4B5563]">
              <span className="text-[#6B7A9F] font-medium">Low Stock</span> is flagged when Current Stock falls below{' '}
              <span className="text-amber-400 font-mono">Reorder Point × (Low Stock Threshold / 100)</span>.{' '}
              <span className="text-[#6B7A9F] font-medium">Overstock</span> when above{' '}
              <span className="text-blue-400 font-mono">Reorder Point × (Overstock Threshold / 100)</span>.
            </p>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Notification Preferences">
          <div className="divide-y divide-[#131929]">
            <ToggleRow
              label="Low Stock Alerts"
              description="Notify when any SKU falls below its reorder point"
              checked={notifications.lowStock}
              onChange={(v) => setNotifications((p) => ({ ...p, lowStock: v }))}
            />
            <ToggleRow
              label="Overstock Warnings"
              description="Alert when stock exceeds 3× the reorder point threshold"
              checked={notifications.overstock}
              onChange={(v) => setNotifications((p) => ({ ...p, overstock: v }))}
            />
            <ToggleRow
              label="Forecast Deviation"
              description="Trigger when actual demand deviates >15% from forecast"
              checked={notifications.forecastDeviation}
              onChange={(v) => setNotifications((p) => ({ ...p, forecastDeviation: v }))}
            />
            <ToggleRow
              label="Weekly Digest"
              description="Receive a weekly summary of inventory KPIs every Monday 08:00"
              checked={notifications.weeklyDigest}
              onChange={(v) => setNotifications((p) => ({ ...p, weeklyDigest: v }))}
            />
            <ToggleRow
              label="End-of-Period Alerts"
              description="Notify 5 days before fiscal period close for stock reconciliation"
              checked={notifications.eopAlerts}
              onChange={(v) => setNotifications((p) => ({ ...p, eopAlerts: v }))}
            />
          </div>
        </SectionCard>

        {/* Integrations */}
        <SectionCard icon={Plug} title="Integrations">
          <div className="space-y-3">
            {integrations.map(({ name, description, status, icon }) => (
              <div key={name} className="flex items-center gap-4 p-4 rounded-lg border border-[#1A2035] bg-[#0A0E1A] hover:border-[#2A3A5C] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#0D1422] border border-[#1E2D4A] flex items-center justify-center text-[#6B7A9F] text-lg font-mono flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#E2E8F0]">{name}</p>
                    {status === 'connected' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-0.5 truncate">{description}</p>
                </div>
                <button
                  disabled={status !== 'connected'}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    status === 'connected'
                      ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer'
                      : 'border-[#1E2D4A] text-[#374151] cursor-not-allowed'
                  }`}
                >
                  {status === 'connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

      </div>
    </AppShell>
  )
}
