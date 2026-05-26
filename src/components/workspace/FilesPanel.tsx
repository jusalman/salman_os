import { useMemo, useState } from 'react'
import type {
  DriveFileCategory,
  DriveFileCategorySummary,
  DriveFileRepositoryResult,
  DriveFileStatus,
  DriveFileSummary,
} from '../../domain/driveFiles'
import { Panel } from '../common/Panel'

type FilesPanelProps = {
  driveResult: DriveFileRepositoryResult | null
  loading: boolean
  error: string
  onReload: () => void
}

const EMPTY_DRIVE_FILES: DriveFileSummary[] = []
const EMPTY_DRIVE_CATEGORIES: DriveFileCategorySummary[] = []

export function FilesPanel({ driveResult, loading, error, onReload }: FilesPanelProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<DriveFileCategory | 'all'>('all')
  const [notice, setNotice] = useState('')
  const files = driveResult?.files ?? EMPTY_DRIVE_FILES
  const folders = driveResult?.categories ?? EMPTY_DRIVE_CATEGORIES
  const visibleFiles = useMemo(
    () =>
      selectedFolderId === 'all'
        ? files
        : files.filter((file) => file.category === selectedFolderId),
    [files, selectedFolderId],
  )
  const visibleDiagnostics = useMemo(
    () => driveResult?.diagnostics.filter((diagnostic) => diagnostic.severity !== 'info') ?? [],
    [driveResult],
  )

  function handlePreparedAction(actionName: string) {
    setNotice(`${actionName}은 mock Drive repository boundary에서만 준비된 상태입니다.`)
  }

  return (
    <Panel title="구글 드라이브" subtitle="고객사 원본 파일 구조와 연결 상태">
      <div className="drive-hub">
        <div className="drive-toolbar">
          <div>
            <strong>구조화된 원본 파일</strong>
            <p>Repository boundary가 반환한 mock Drive metadata를 표시합니다.</p>
          </div>
          <div className="drive-actions">
            <button type="button" onClick={() => handlePreparedAction('파일 추가')}>
              파일 추가
            </button>
            <button type="button" onClick={() => handlePreparedAction('폴더 만들기')}>
              폴더 만들기
            </button>
            <button type="button" onClick={() => handlePreparedAction('드라이브 동기화')}>
              드라이브 동기화
            </button>
          </div>
        </div>

        {notice ? <p className="drive-notice">{notice}</p> : null}

        {error ? (
          <div className="drive-empty">
            <strong>Drive metadata를 불러오지 못했습니다.</strong>
            <p>{error}</p>
            <button type="button" className="ghost-action" onClick={onReload}>
              다시 불러오기
            </button>
          </div>
        ) : loading ? (
          <div className="drive-empty">
            <strong>Drive metadata를 불러오는 중입니다.</strong>
            <p>실제 Google Drive API 호출 없이 mock repository에서 읽고 있습니다.</p>
          </div>
        ) : (
          <>
            {visibleDiagnostics.map((diagnostic) => (
              <p key={diagnostic.code} className="drive-notice">
                {diagnostic.message}
              </p>
            ))}

            <div className="drive-layout">
              <aside className="drive-tree" aria-label="구글 드라이브 폴더 구조">
                <button
                  type="button"
                  className={selectedFolderId === 'all' ? 'drive-folder active' : 'drive-folder'}
                  onClick={() => setSelectedFolderId('all')}
                >
                  <span>전체 자료</span>
                  <strong>{files.length}</strong>
                </button>

                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    className={folder.id === selectedFolderId ? 'drive-folder active' : 'drive-folder'}
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <span>{folder.name}</span>
                    <em>{folder.description}</em>
                    <strong>{folder.fileCount}</strong>
                  </button>
                ))}
              </aside>

              <div className="drive-file-list">
                {visibleFiles.length > 0 ? (
                  visibleFiles.map((file) => (
                    <article key={file.id} className="drive-file-row">
                      <div className="drive-file-main">
                        <span className="drive-file-type">{file.fileType}</span>
                        <div>
                          <strong>{file.name}</strong>
                          <p>{file.folderPath}</p>
                        </div>
                      </div>
                      <div className="drive-file-meta">
                        <span className={`status-badge ${file.status}`}>
                          {driveFileStatusLabel[file.status]}
                        </span>
                        <span>{file.uploadedBy}</span>
                        {file.sourceUrl ? (
                          <a
                            className="action-link"
                            href={file.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            원본 열기
                          </a>
                        ) : (
                          <span>원본 링크 준비 중</span>
                        )}
                        <button
                          type="button"
                          className="ghost-action"
                          onClick={() => handlePreparedAction('보관 이동')}
                        >
                          보관 이동
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="drive-empty">
                    <strong>이 폴더에는 표시할 파일이 없습니다.</strong>
                    <p>기본 목록에서는 archived/excluded 파일을 표시하지 않습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}

const driveFileStatusLabel: Record<DriveFileStatus, string> = {
  active: '사용 중',
  archived: '보관',
  excluded: '제외',
}
