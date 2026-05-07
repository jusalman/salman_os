import { moneyStatusLabel } from '../../domain/labels'
import type { ClientMoneyPanelItem } from '../../types'
import { Panel } from '../common/Panel'

type BusinessMoneyPanelProps = {
  moneyItems: ClientMoneyPanelItem[]
}

export function BusinessMoneyPanel({ moneyItems }: BusinessMoneyPanelProps) {
  return (
    <Panel title="Business Money" subtitle="Manual check status only">
      <div className="stack">
        {moneyItems.map((item) => (
          <article key={item.id} className="item-row">
            <div>
              <strong>{item.title}</strong>
              <p>{item.note}</p>
            </div>
            <div className="item-meta">
              <span>{moneyStatusLabel[item.status]}</span>
              <span>{item.lastCheckedAt ?? 'Not checked'}</span>
              <span>{item.checkedBy ?? 'Unassigned'}</span>
              <a href={item.url} target="_blank" rel="noreferrer">
                Check Link
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
