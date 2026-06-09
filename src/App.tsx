import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { LoginView } from './components/login/LoginView'
import { Workspace } from './components/workspace/Workspace'
import { APP_PASSWORD } from './config/constants'
import { projectWorkspaceView } from './data/projections/workspaceView'
import { useClients } from './hooks/useClients'
import { useSelectedClient } from './hooks/useSelectedClient'
import { useSmartViews } from './hooks/useSmartViews'

function App() {
  const { clients, loading, error: loadError, reload } = useClients()
  const {
    smartViews,
    loading: smartViewsLoading,
    error: smartViewsError,
    reload: reloadSmartViews,
  } = useSmartViews()
  const [password, setPassword] = useState('')
  const [staffName, setStaffName] = useState('')
  const [viewerName, setViewerName] = useState('')
  const [error, setError] = useState('')
  const [selectedClientId, setSelectedClientId] = useState('')
  const fallbackClientId = selectedClientId
  const {
    selectedClient,
    resolvedClientId,
    loading: selectedClientLoading,
    error: selectedClientError,
    reload: reloadSelectedClient,
  } = useSelectedClient({
    selectedClientId,
    fallbackClientId,
  })
  const selectedClientForWorkspace = selectedClientId ? selectedClient : null
  const workspaceView = projectWorkspaceView({
    clients,
    selectedClient: selectedClientForWorkspace,
    smartViews,
  })

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== APP_PASSWORD) {
      setError('공통 비밀번호가 일치하지 않습니다.')
      return
    }

    if (!staffName.trim()) {
      setError('작업자 이름을 입력해 주세요.')
      return
    }

    setError('')
    setViewerName(staffName.trim())
  }

  return (
    <main className="shell">
      {viewerName ? (
        loading ? (
          <StatusView
            title="고객사 정보를 불러오는 중입니다"
            message="SALMAN OS 운영센터에 표시할 고객사 데이터를 준비하고 있습니다."
          />
        ) : loadError ? (
          <StatusView
            title="고객사 정보를 불러오지 못했습니다"
            message={loadError}
            actionLabel="다시 불러오기"
            onAction={() => void reload()}
          />
        ) : clients.length === 0 ? (
          <StatusView
            title="표시할 고객사가 없습니다"
            message="아직 SALMAN OS에 연결된 고객사 운영 데이터가 없습니다."
            actionLabel="다시 불러오기"
            onAction={() => void reload()}
          />
        ) : smartViewsLoading ? (
          <StatusView
            title="운영 요약을 준비하는 중입니다"
            message="고객사별 업무, 일정, 비즈머니 상태를 정리하고 있습니다."
          />
        ) : smartViewsError ? (
          <StatusView
            title="운영 요약을 불러오지 못했습니다"
            message={smartViewsError}
            actionLabel="운영 요약 다시 불러오기"
            onAction={() => void reloadSmartViews()}
          />
        ) : !smartViews ? (
          <StatusView
            title="운영 요약을 표시할 수 없습니다"
            message="SALMAN OS가 현재 고객사 운영 요약을 구성하지 못했습니다."
            actionLabel="운영 요약 다시 불러오기"
            onAction={() => void reloadSmartViews()}
          />
        ) : selectedClientId && selectedClientLoading ? (
          <StatusView
            title="선택한 고객사를 불러오는 중입니다"
            message="고객사 운영 화면을 준비하고 있습니다."
          />
        ) : selectedClientId && selectedClientError ? (
          <StatusView
            title="선택한 고객사를 불러오지 못했습니다"
            message={selectedClientError}
            actionLabel="고객사 다시 불러오기"
            onAction={() => void reloadSelectedClient()}
          />
        ) : selectedClientId && !selectedClient ? (
          <StatusView
            title="선택한 고객사를 표시할 수 없습니다"
            message="SALMAN OS가 고객사 상세 정보를 찾지 못했습니다."
            actionLabel="고객사 다시 불러오기"
            onAction={() => void reloadSelectedClient()}
          />
        ) : !workspaceView ? (
          <StatusView
            title="운영 화면을 구성할 수 없습니다"
            message="SALMAN OS가 고객사 운영 화면을 조립하지 못했습니다."
            actionLabel="고객사 다시 불러오기"
            onAction={() => void reloadSelectedClient()}
          />
        ) : (
          <Workspace
            viewerName={viewerName}
            workspaceView={workspaceView}
            selectedClientId={resolvedClientId}
            onSelectClient={setSelectedClientId}
          />
        )
      ) : (
        <LoginView
          password={password}
          staffName={staffName}
          error={error}
          onPasswordChange={setPassword}
          onStaffNameChange={setStaffName}
          onSubmit={handleLogin}
        />
      )}
    </main>
  )
}

type StatusViewProps = {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

function StatusView({ title, message, actionLabel, onAction }: StatusViewProps) {
  return (
    <section className="login-view">
      <div className="login-panel status-panel">
        <div>
          <p className="eyebrow">SALMAN OS / 내부 운영센터</p>
          <h1>{title}</h1>
          <p className="intro">{message}</p>
        </div>

        {actionLabel && onAction ? (
          <div className="status-actions">
            <button type="button" onClick={onAction}>
              {actionLabel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default App
