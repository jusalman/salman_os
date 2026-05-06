import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function Panel({ title, subtitle, children }: PanelProps) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}
