import { fileStatusLabel } from '../../domain/labels'
import type { ClientFilePanelItem } from '../../types'
import { Panel } from '../common/Panel'

type FilesPanelProps = {
  files: ClientFilePanelItem[]
}

export function FilesPanel({ files }: FilesPanelProps) {
  return (
    <Panel title="자료" subtitle="Google Drive 원본 파일">
      <div className="stack">
        {files.map((file) => (
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
                열기
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
