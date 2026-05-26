import { eventStatusLabel } from '../../domain/labels'
import type { ClientSchedulePanelItem } from '../../types'
import { Panel } from '../common/Panel'

type InternalSchedulePanelProps = {
  scheduleItems: ClientSchedulePanelItem[]
}

export function InternalSchedulePanel({ scheduleItems }: InternalSchedulePanelProps) {
  return (
    <Panel title="내부 일정" subtitle="SALMAN OS에 기록된 고객사 일정">
      <div className="stack">
        {scheduleItems.map((event) => (
          <article key={event.id} className="item-row">
            <div>
              <strong>{event.title}</strong>
              <p>{event.note}</p>
            </div>
            <div className="item-meta">
              <span>{event.eventDate}</span>
              <span>{event.timeRange}</span>
              <span>{event.owner}</span>
              <span className={`status-badge ${event.status}`}>{eventStatusLabel[event.status]}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
