import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#070B14]">
      <Sidebar />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  )
}
