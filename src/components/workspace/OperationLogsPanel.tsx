import type { ClientLogPanelItem } from '../../types'
import { Panel } from '../common/Panel'

type OperationLogsPanelProps = {
  logs: ClientLogPanelItem[]
}

export function OperationLogsPanel({ logs }: OperationLogsPanelProps) {
  return (
    <Panel title="Operation Logs" subtitle="Recent internal changes">
      <div className="stack compact">
        {logs.map((log) => (
          <article key={log.id} className="item-row">
            <div>
              <strong>{log.message}</strong>
              <p>{log.actor}</p>
            </div>
            <div className="item-meta">
              <span>{log.action}</span>
              <span>{log.createdAt}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
