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
  const fallbackClientId = clients[0]?.id ?? ''
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
  const workspaceView = projectWorkspaceView({
    clients,
    selectedClient,
  })

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== APP_PASSWORD) {
      setError('Common password does not match `salman1!`.')
      return
    }

    if (!staffName.trim()) {
      setError('Enter your name to continue.')
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
            title="Loading client data"
            message="Preparing SALMAN OS internal client records."
          />
        ) : loadError ? (
          <StatusView
            title="Client data unavailable"
            message={loadError}
            actionLabel="Reload data"
            onAction={() => void reload()}
          />
        ) : clients.length === 0 ? (
          <StatusView
            title="No clients found"
            message="SALMAN OS has no client records to display yet."
            actionLabel="Reload data"
            onAction={() => void reload()}
          />
        ) : smartViewsLoading ? (
          <StatusView
            title="Loading smart views"
            message="Preparing SALMAN OS operation summaries."
          />
        ) : smartViewsError ? (
          <StatusView
            title="Smart views unavailable"
            message={smartViewsError}
            actionLabel="Reload smart views"
            onAction={() => void reloadSmartViews()}
          />
        ) : !smartViews ? (
          <StatusView
            title="Smart views unavailable"
            message="SALMAN OS could not resolve operation summaries."
            actionLabel="Reload smart views"
            onAction={() => void reloadSmartViews()}
          />
        ) : selectedClientLoading ? (
          <StatusView
            title="Loading selected client"
            message="Preparing SALMAN OS client detail view."
          />
        ) : selectedClientError ? (
          <StatusView
            title="Selected client unavailable"
            message={selectedClientError}
            actionLabel="Reload client"
            onAction={() => void reloadSelectedClient()}
          />
        ) : !selectedClient ? (
          <StatusView
            title="Selected client unavailable"
            message="SALMAN OS could not resolve a client detail record."
            actionLabel="Reload client"
            onAction={() => void reloadSelectedClient()}
          />
        ) : !workspaceView ? (
          <StatusView
            title="Selected client unavailable"
            message="SALMAN OS could not assemble a workspace view."
            actionLabel="Reload client"
            onAction={() => void reloadSelectedClient()}
          />
        ) : (
        <Workspace
          viewerName={viewerName}
          workspaceView={workspaceView}
          smartViews={smartViews}
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
          <p className="eyebrow">SALMAN OS / Internal MVP</p>
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
