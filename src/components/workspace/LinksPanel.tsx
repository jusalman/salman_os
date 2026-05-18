import type { ClientLinkPanelItem } from '../../types'
import { Panel } from '../common/Panel'

type LinksPanelProps = {
  links: ClientLinkPanelItem[]
}

export function LinksPanel({ links }: LinksPanelProps) {
  return (
    <Panel title="링크" subtitle="운영에 필요한 바로가기">
      <div className="stack compact">
        {links.map((link) => (
          <article key={link.id} className="item-row">
            <div>
              <strong>{link.title}</strong>
              <p>{link.category}</p>
            </div>
            <div className="item-meta">
              <a href={link.url} target="_blank" rel="noreferrer">
                링크 열기
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
