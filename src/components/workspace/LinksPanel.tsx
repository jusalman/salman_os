import type { ClientLinkPanelItem } from '../../types'
import { Panel } from '../common/Panel'

type LinksPanelProps = {
  links: ClientLinkPanelItem[]
}

export function LinksPanel({ links }: LinksPanelProps) {
  return (
    <Panel title="Links" subtitle="Operational shortcuts">
      <div className="stack compact">
        {links.map((link) => (
          <article key={link.id} className="item-row">
            <div>
              <strong>{link.title}</strong>
              <p>{link.category}</p>
            </div>
            <div className="item-meta">
              <a href={link.url} target="_blank" rel="noreferrer">
                Open Link
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
