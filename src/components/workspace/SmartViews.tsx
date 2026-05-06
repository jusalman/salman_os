import type { SmartViews as SmartViewsData } from '../../domain/smartViews'

type SmartViewsProps = {
  data: SmartViewsData
}

const cards: Array<{ key: keyof SmartViewsData; title: string }> = [
  { key: 'todaysItems', title: 'Today' },
  { key: 'priorityTasks', title: 'Priority tasks' },
  { key: 'moneyAlerts', title: 'Money checks' },
  { key: 'recentArchive', title: 'Recent archive' },
]

export function SmartViews({ data }: SmartViewsProps) {
  return (
    <div className="smart-views">
      <div className="section-head">
        <h3>Smart Operation Views</h3>
        <span>Template only</span>
      </div>

      {cards.map((card) => (
        <article key={card.key} className="smart-card">
          <p className="smart-title">{card.title}</p>
          <ul>
            {data[card.key].map((item) => (
              <li key={`${card.key}-${item.clientName}-${item.title}`}>
                <strong>{item.clientName}</strong>
                <span>{item.title}</span>
                <em>{item.meta}</em>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
