import { moneyStatusLabel } from '../../domain/labels'
import type { ClientMoneyPanelItem } from '../../types'
import { Panel } from '../common/Panel'

type BusinessMoneyPanelProps = {
  moneyItems: ClientMoneyPanelItem[]
}

export function BusinessMoneyPanel({ moneyItems }: BusinessMoneyPanelProps) {
  return (
    <Panel title="비즈머니" subtitle="수동 확인 기준 상태">
      <div className="stack">
        {moneyItems.map((item) => (
          <article key={item.id} className="item-row">
            <div>
              <strong>{item.title}</strong>
              <p>{item.note}</p>
            </div>
            <div className="item-meta">
              <span>{moneyStatusLabel[item.status]}</span>
              <span>{item.lastCheckedAt ?? '미확인'}</span>
              <span>{item.checkedBy ?? '담당자 없음'}</span>
              <a href={item.url} target="_blank" rel="noreferrer">
                확인 링크
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
