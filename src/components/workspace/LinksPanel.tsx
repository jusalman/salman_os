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
              <p>{linkCategoryLabel[link.category]}</p>
            </div>
            <div className="item-meta">
              <a className="action-link" href={link.url} target="_blank" rel="noreferrer">
                링크 열기
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}

const linkCategoryLabel: Record<ClientLinkPanelItem['category'], string> = {
  admin: '관리자',
  drive: '구글 드라이브',
  external: '외부 링크',
  report: '리포트',
}
