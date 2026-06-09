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
  const [selectedFileId, setSelectedFileId] = useState('')
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
  const selectedFile =
    visibleFiles.find((file) => file.id === selectedFileId) ?? visibleFiles[0] ?? null

  function handleSelectFolder(folderId: DriveFileCategory | 'all') {
    setSelectedFolderId(folderId)
    setSelectedFileId('')
  }

  function handlePreparedAction(actionName: string) {
    setNotice(`${actionName} 기능은 mock Drive repository 경계에서만 준비된 상태입니다.`)
  }

  return (
    <Panel title="자료실" subtitle="고객사 원본 파일 구조와 연결 상태">
      <div className="drive-hub">
        <div className="drive-toolbar">
          <div>
            <strong>Google Drive 원본 파일 인덱스</strong>
            <p>실제 Drive API 연결 없이 mock Drive metadata만 표시합니다.</p>
          </div>
          <div className="drive-actions">
            <button type="button" onClick={() => handlePreparedAction('파일 추가')}>
              파일 추가
            </button>
            <button type="button" onClick={() => handlePreparedAction('폴더 만들기')}>
              폴더 만들기
            </button>
            <button type="button" onClick={() => handlePreparedAction('드라이브 동기화')}>
              동기화
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
              <aside className="drive-tree" aria-label="자료실 폴더 트리">
                <div className="drive-column-head">
                  <strong>폴더</strong>
                  <span>{folders.length.toLocaleString('ko-KR')}개 분류</span>
                </div>
                <button
                  type="button"
                  className={selectedFolderId === 'all' ? 'drive-folder active' : 'drive-folder'}
                  onClick={() => handleSelectFolder('all')}
                >
                  <span>전체 자료</span>
                  <strong>{files.length}</strong>
                </button>

                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    className={folder.id === selectedFolderId ? 'drive-folder active' : 'drive-folder'}
                    onClick={() => handleSelectFolder(folder.id)}
                  >
                    <span>{folder.name}</span>
                    <em>{folder.description}</em>
                    <strong>{folder.fileCount}</strong>
                  </button>
                ))}
              </aside>

              <div className="drive-file-list">
                <div className="drive-column-head">
                  <strong>파일</strong>
                  <span>{visibleFiles.length.toLocaleString('ko-KR')}개</span>
                </div>
                {visibleFiles.length > 0 ? (
                  visibleFiles.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      className={selectedFile?.id === file.id ? 'drive-file-row active' : 'drive-file-row'}
                      onClick={() => setSelectedFileId(file.id)}
                    >
                      <div className="drive-file-main">
                        <span className="drive-file-type">{file.fileType}</span>
                        <div>
                          <strong>{file.name}</strong>
                          <p>{file.folderPath}</p>
                        </div>
                      </div>
                      <span className={`status-badge ${file.status}`}>
                        {driveFileStatusLabel[file.status]}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="drive-empty">
                    <strong>이 폴더에는 표시할 파일이 없습니다.</strong>
                    <p>기본 목록에서는 archived/excluded 파일을 표시하지 않습니다.</p>
                  </div>
                )}
              </div>

              <aside className="drive-detail-panel" aria-label="파일 상세">
                <div className="drive-column-head">
                  <strong>파일 상세</strong>
                  <span>mock metadata</span>
                </div>
                {selectedFile ? (
                  <FileDetail
                    file={selectedFile}
                    onPreparedAction={handlePreparedAction}
                  />
                ) : (
                  <div className="drive-empty">
                    <strong>선택된 파일이 없습니다.</strong>
                    <p>가운데 파일 리스트에서 파일을 선택하세요.</p>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}

function FileDetail({
  file,
  onPreparedAction,
}: {
  file: DriveFileSummary
  onPreparedAction: (actionName: string) => void
}) {
  return (
    <div className="drive-detail-content">
      <span className="drive-file-type">{file.fileType}</span>
      <h4>{file.name}</h4>
      <dl>
        <div>
          <dt>폴더</dt>
          <dd>{file.folderPath}</dd>
        </div>
        <div>
          <dt>상태</dt>
          <dd>
            <span className={`status-badge ${file.status}`}>
              {driveFileStatusLabel[file.status]}
            </span>
          </dd>
        </div>
        <div>
          <dt>업로드 담당</dt>
          <dd>{file.uploadedBy}</dd>
        </div>
        <div>
          <dt>연결 업무</dt>
          <dd>연결 준비 중</dd>
        </div>
        <div>
          <dt>메모</dt>
          <dd>원본 파일 링크와 업무 연결은 mock metadata 기준으로만 표시합니다.</dd>
        </div>
      </dl>
      {file.sourceUrl ? (
        <a className="action-link" href={file.sourceUrl} target="_blank" rel="noreferrer">
          원본 열기
        </a>
      ) : (
        <button
          type="button"
          className="ghost-action"
          onClick={() => onPreparedAction('원본 열기')}
        >
          원본 열기 준비 중
        </button>
      )}
    </div>
  )
}

const driveFileStatusLabel: Record<DriveFileStatus, string> = {
  active: '사용 중',
  archived: '보관',
  excluded: '제외',
}
