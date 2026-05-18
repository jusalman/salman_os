import type { SmartViews as SmartViewsData } from '../../domain/smartViews'

type SmartViewsProps = {
  data: SmartViewsData
}

const cards: Array<{ key: keyof SmartViewsData; title: string }> = [
  { key: 'todaysItems', title: '오늘 볼 항목' },
  { key: 'priorityTasks', title: '우선 업무' },
  { key: 'moneyAlerts', title: '비즈머니 확인' },
  { key: 'recentArchive', title: '최근 보관' },
]

export function SmartViews({ data }: SmartViewsProps) {
  return (
    <div className="smart-views">
      <div className="section-head">
        <h3>스마트 운영 보기</h3>
        <span>템플릿 기준</span>
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
