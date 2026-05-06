import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { LoginView } from './components/login/LoginView'
import { Workspace } from './components/workspace/Workspace'
import { APP_PASSWORD } from './config/constants'
import { getClients, getInitialClientId } from './data/clientRepository'

function App() {
  const clients = getClients()
  const [password, setPassword] = useState('')
  const [staffName, setStaffName] = useState('')
  const [viewerName, setViewerName] = useState('')
  const [error, setError] = useState('')
  const [selectedClientId, setSelectedClientId] = useState(getInitialClientId())

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
        <Workspace
          viewerName={viewerName}
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
        />
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

export default App
