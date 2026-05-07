import { eventStatusLabel } from '../../domain/labels'
import type { ClientSchedulePanelItem } from '../../types'
import { Panel } from '../common/Panel'

type InternalSchedulePanelProps = {
  scheduleItems: ClientSchedulePanelItem[]
}

export function InternalSchedulePanel({ scheduleItems }: InternalSchedulePanelProps) {
  return (
    <Panel title="Internal Schedule" subtitle="Supabase-based client schedule">
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
              <span>{eventStatusLabel[event.status]}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
