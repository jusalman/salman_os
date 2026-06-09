import { clientStatusLabel } from '../../domain/labels'
import type { ClientListView } from '../../types'

type ClientTabsProps = {
  listView: ClientListView
  selectedClientId: string
  onSelect: (clientId: string) => void
}

export function ClientTabs({ listView, selectedClientId, onSelect }: ClientTabsProps) {
  return (
    <section className="client-strip" aria-label="고객사 목록">
      {listView.items.map((client) => (
        <button
          key={client.id}
          type="button"
          className={client.id === selectedClientId ? 'client-chip active' : 'client-chip'}
          onClick={() => onSelect(client.id)}
        >
          <div className="client-chip-title">
            <div>
              <span className="client-chip-kicker">Client</span>
              <strong>{client.name}</strong>
            </div>
            <span className={`status-badge ${client.status}`}>
              {clientStatusLabel[client.status]}
            </span>
          </div>

          <div className="client-chip-owner">
            <span>담당자</span>
            <strong>{client.owner}</strong>
          </div>

          <div className="client-chip-meta">
            <span>
              <em>진행 업무</em>
              <strong>{client.openTaskCount}</strong>
            </span>
            <span>
              <em>예정 일정</em>
              <strong>{client.upcomingEventCount}</strong>
            </span>
            <span className={client.hasBizMoneyWarning ? 'warning' : 'normal'}>
              <em>비즈머니</em>
              <strong>{client.hasBizMoneyWarning ? '확인' : '정상'}</strong>
            </span>
          </div>

          <div className="client-chip-footer">
            <p>{client.latestLogAt ? `최근 로그 ${client.latestLogAt}` : '최근 로그 없음'}</p>
            <span>상세 보기</span>
          </div>
        </button>
      ))}
    </section>
  )
}
