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
        <h3>오늘의 체크리스트</h3>
        <span>자동 분류</span>
      </div>

      {cards.map((card) => (
        <article key={card.key} className="smart-card">
          <p className="smart-title">{card.title}</p>
          {data[card.key].length > 0 ? (
            <ul>
              {data[card.key].map((item) => (
                <li key={`${card.key}-${item.clientName}-${item.title}`}>
                  <strong>{item.clientName}</strong>
                  <span>{item.title}</span>
                  <em>{item.meta}</em>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">해당 항목 없음</p>
          )}
        </article>
      ))}
    </div>
  )
}
