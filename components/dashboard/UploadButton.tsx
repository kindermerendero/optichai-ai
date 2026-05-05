'use client'

import { useRef, useState } from 'react'
import { Upload, CheckCircle2, X } from 'lucide-react'

export function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploaded, setUploaded] = useState<string | null>(null)

  const handleClick = () => inputRef.current?.click()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploaded(file.name)
    }
    e.target.value = ''
  }

  const dismiss = () => setUploaded(null)

  if (uploaded) {
    return (
      <div className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 animate-fade-in">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-mono truncate max-w-[160px]">{uploaded}</span>
        <button
          onClick={dismiss}
          className="p-0.5 rounded hover:bg-emerald-500/20 transition-colors ml-1"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={handleClick}
        className="group flex items-center gap-2.5 px-4 py-2 rounded-lg
          bg-[#0D1422] border border-[#1E2D4A]
          hover:border-emerald-500/40 hover:bg-emerald-500/5
          text-[#6B7A9F] hover:text-emerald-400
          transition-all duration-200 text-[13px] font-medium"
      >
        <Upload className="w-3.5 h-3.5 group-hover:-translate-y-px transition-transform duration-200" />
        Upload Supply Chain Data
        <span className="text-[10px] font-mono text-[#374151] group-hover:text-emerald-500/60 bg-[#0A0E1A] border border-[#1A2035] px-1.5 py-0.5 rounded">
          CSV
        </span>
      </button>
    </>
  )
}
