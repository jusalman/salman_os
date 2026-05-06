import {
  eventStatusLabel,
  fileStatusLabel,
  moneyStatusLabel,
  taskPriorityLabel,
  taskStatusLabel,
} from '../../domain/labels'
import { buildSmartViews } from '../../domain/smartViews'
import type { ClientRecord } from '../../types'
import { Panel } from '../common/Panel'
import { ClientOverview } from './ClientOverview'
import { ClientTabs } from './ClientTabs'
import { SmartViews } from './SmartViews'

type WorkspaceProps = {
  viewerName: string
  clients: ClientRecord[]
  selectedClientId: string
  onSelectClient: (clientId: string) => void
}

export function Workspace({
  viewerName,
  clients,
  selectedClientId,
  onSelectClient,
}: WorkspaceProps) {
  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0]
  const smartViews = buildSmartViews(clients)

  return (
    <section className="workspace">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">SALMAN OS</p>
          <h2>Internal client ops</h2>
          <p className="sidebar-copy">
            Signed in as <strong>{viewerName}</strong>
          </p>
        </div>
        <SmartViews data={smartViews} />
      </aside>

      <div className="main-pane">
        <header className="topbar">
          <div>
            <p className="eyebrow">v1 / Internal Staff MVP</p>
            <h1>Client operation center</h1>
          </div>
          <div className="topbar-notes">
            <span>Supabase = operational data</span>
            <span>Google Drive = source files</span>
            <span>No AI / No Google Calendar sync</span>
          </div>
        </header>

        <ClientTabs
          clients={clients}
          selectedClientId={selectedClientId}
          onSelect={onSelectClient}
        />

        <ClientOverview client={selectedClient} />

        <section className="panel-grid">
          <Panel title="Files" subtitle="Source files from Google Drive">
            <div className="stack">
              {selectedClient.files.map((file) => (
                <article key={file.id} className="item-row">
                  <div>
                    <strong>{file.name}</strong>
                    <p>{file.folderPath}</p>
                  </div>
                  <div className="item-meta">
                    <span>{file.type}</span>
                    <span>{fileStatusLabel[file.status]}</span>
                    <span>{file.uploadedBy}</span>
                    <a href={file.driveUrl} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Tasks" subtitle="Operational work by client">
            <div className="stack">
              {selectedClient.tasks.map((task) => (
                <article key={task.id} className="item-row">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.note}</p>
                  </div>
                  <div className="item-meta">
                    <span>{taskStatusLabel[task.status]}</span>
                    <span>{taskPriorityLabel[task.priority]}</span>
                    <span>{task.assignee}</span>
                    <span>{task.dueDate}</span>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Internal Schedule" subtitle="Supabase-based client schedule">
            <div className="stack">
              {selectedClient.events.map((event) => (
                <article key={event.id} className="item-row">
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.note}</p>
                  </div>
                  <div className="item-meta">
                    <span>{event.eventDate}</span>
                    <span>{`${event.startTime}-${event.endTime}`}</span>
                    <span>{event.owner}</span>
                    <span>{eventStatusLabel[event.status]}</span>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Business Money" subtitle="Manual check status only">
            <div className="stack">
              {selectedClient.moneyItems.map((item) => (
                <article key={item.id} className="item-row">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.note}</p>
                  </div>
                  <div className="item-meta">
                    <span>{moneyStatusLabel[item.status]}</span>
                    <span>{item.lastCheckedAt ?? 'Not checked'}</span>
                    <span>{item.checkedBy ?? 'Unassigned'}</span>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      Check Link
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Links" subtitle="Operational shortcuts">
            <div className="stack compact">
              {selectedClient.links.map((link) => (
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

          <Panel title="Operation Logs" subtitle="Recent internal changes">
            <div className="stack compact">
              {selectedClient.logs.map((log) => (
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
        </section>
      </div>
    </section>
  )
}
