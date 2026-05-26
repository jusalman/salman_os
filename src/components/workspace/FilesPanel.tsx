import { useMemo, useState } from 'react'
import { fileStatusLabel } from '../../domain/labels'
import type { ClientFilePanelItem } from '../../types'
import { Panel } from '../common/Panel'

type FilesPanelProps = {
  files: ClientFilePanelItem[]
}

type DriveFolderView = {
  id: string
  name: string
  description: string
  matchText: string[]
}

const driveFolders: DriveFolderView[] = [
  {
    id: '01_Client_Operations',
    name: '01_Client_Operations',
    description: '고객사 운영 자료',
    matchText: ['고객사 운영'],
  },
  {
    id: '04_SA_Operations',
    name: '04_SA_Operations',
    description: '검색광고 운영 자료',
    matchText: ['검색광고', 'SA'],
  },
  {
    id: '06_Creative_Assets',
    name: '06_Creative_Assets',
    description: '소재와 제작 파일',
    matchText: ['제작 소재', '광고 소재'],
  },
  {
    id: '08_Reports_Insights',
    name: '08_Reports_Insights',
    description: '리포트와 분석 자료',
    matchText: ['리포트', '분석'],
  },
  {
    id: '12_Admin_Finance_Legal',
    name: '12_Admin_Finance_Legal',
    description: '계약과 정산 자료',
    matchText: ['계약·정산', '계약서'],
  },
  {
    id: '99_Archive',
    name: '99_Archive',
    description: '삭제 대신 보관',
    matchText: ['보관함'],
  },
]

export function FilesPanel({ files }: FilesPanelProps) {
  const [selectedFolderId, setSelectedFolderId] = useState('all')
  const [notice, setNotice] = useState('')
  const selectedFolder = driveFolders.find((folder) => folder.id === selectedFolderId)
  const visibleFiles = useMemo(
    () =>
      selectedFolder
        ? files.filter((file) =>
            selectedFolder.matchText.some((text) => file.folderPath.includes(text)),
          )
        : files,
    [files, selectedFolder],
  )

  function handlePreparedAction(actionName: string) {
    setNotice(`${actionName}은 구글드라이브 API 연결 후 실제 드라이브에 반영됩니다.`)
  }

  return (
    <Panel title="구글 드라이브" subtitle="고객사 원본 파일 구조와 연결 상태">
      <div className="drive-hub">
        <div className="drive-toolbar">
          <div>
            <strong>구조화된 원본 파일</strong>
            <p>폴더 구조를 기준으로 필요한 자료를 빠르게 찾고 관리합니다.</p>
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

            {driveFolders.map((folder) => {
              const fileCount = files.filter((file) =>
                folder.matchText.some((text) => file.folderPath.includes(text)),
              ).length

              return (
                <button
                  key={folder.id}
                  type="button"
                  className={folder.id === selectedFolderId ? 'drive-folder active' : 'drive-folder'}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <span>{folder.name}</span>
                  <em>{folder.description}</em>
                  <strong>{fileCount}</strong>
                </button>
              )
            })}
          </aside>

          <div className="drive-file-list">
            {visibleFiles.length > 0 ? (
              visibleFiles.map((file) => (
                <article key={file.id} className="drive-file-row">
                  <div className="drive-file-main">
                    <span className="drive-file-type">{file.type}</span>
                    <div>
                      <strong>{file.name}</strong>
                      <p>{file.folderPath}</p>
                    </div>
                  </div>
                  <div className="drive-file-meta">
                    <span className={`status-badge ${file.status}`}>
                      {fileStatusLabel[file.status]}
                    </span>
                    <span>{file.uploadedBy}</span>
                    <a className="action-link" href={file.driveUrl} target="_blank" rel="noreferrer">
                      원본 열기
                    </a>
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
                <p>파일 추가 또는 드라이브 동기화 후 이 영역에 자료가 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  )
}
