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
  const selectedFile = visibleFiles.find((file) => file.id === selectedFileId) ?? null

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
            <strong>고객사 자료실</strong>
            <p>폴더별 자료와 파일 상세 정보를 mock Drive metadata 기준으로 확인합니다.</p>
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
                  <span>
                    {selectedFolderId === 'all' ? '전체 자료' : getCategoryName(selectedFolderId, folders)}
                    {' · '}
                    {visibleFiles.length.toLocaleString('ko-KR')}개
                  </span>
                </div>
                {visibleFiles.length > 0 ? (
                  visibleFiles.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      className={selectedFileId === file.id ? 'drive-file-row active' : 'drive-file-row'}
                      onClick={() => setSelectedFileId(file.id)}
                    >
                      <div className="drive-file-main">
                        <span className="drive-file-type">{file.fileType}</span>
                        <div>
                          <strong>{file.name}</strong>
                          <p>{file.folderPath}</p>
                          <div className="drive-file-submeta">
                            <span>{file.uploadedBy}</span>
                            <span>{file.uploadedAt}</span>
                            <span>{driveFileSensitivityLabel[file.sensitivity]}</span>
                          </div>
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
                    <p>기본 목록에서는 archived 파일과 excluded 파일을 표시하지 않습니다.</p>
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
                    <strong>파일을 선택하면 상세 정보가 표시됩니다.</strong>
                    <p>가운데 파일 리스트에서 확인할 자료를 선택하세요.</p>
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
      <div className="drive-detail-title">
        <span className="drive-file-type">{file.fileType}</span>
        <h4>{file.name}</h4>
      </div>

      <dl className="drive-detail-grid">
        <div>
          <dt>파일 유형</dt>
          <dd>{file.fileType}</dd>
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
          <dt>민감도</dt>
          <dd>
            <span className={`status-badge ${file.sensitivity}`}>
              {driveFileSensitivityLabel[file.sensitivity]}
            </span>
          </dd>
        </div>
        <div>
          <dt>폴더 위치</dt>
          <dd>{file.folderPath}</dd>
        </div>
        <div>
          <dt>등록자</dt>
          <dd>{file.uploadedBy}</dd>
        </div>
        <div>
          <dt>등록일</dt>
          <dd>{file.uploadedAt}</dd>
        </div>
      </dl>

      <div className="drive-source-box">
        <strong>원본 파일</strong>
        {file.sourceUrl ? (
          <a className="action-link" href={file.sourceUrl} target="_blank" rel="noreferrer">
            원본 열기
          </a>
        ) : (
          <span className="drive-link-pending">원본 링크 준비 중</span>
        )}
      </div>

      <dl className="drive-detail-notes">
        <div>
          <dt>연결된 업무</dt>
          <dd>업무 연결은 후속 승인 작업에서 연결할 mock 준비 영역입니다.</dd>
        </div>
        <div>
          <dt>메모</dt>
          <dd>원본 파일 위치와 업무 연결 메모는 mock Drive repository 경계 안에서만 표시합니다.</dd>
        </div>
      </dl>

      <button
        type="button"
        className="ghost-action drive-archive-action"
        onClick={() => onPreparedAction('보관 이동')}
      >
        보관 이동
      </button>
    </div>
  )
}

function getCategoryName(
  categoryId: DriveFileCategory,
  folders: DriveFileCategorySummary[],
) {
  return folders.find((folder) => folder.id === categoryId)?.name ?? '선택 폴더'
}

const driveFileStatusLabel: Record<DriveFileStatus, string> = {
  active: '사용 중',
  archived: '보관',
  excluded: '제외',
}

const driveFileSensitivityLabel: Record<DriveFileSummary['sensitivity'], string> = {
  approved: '승인됨',
  internal: '내부용',
  restricted: '제한',
}
