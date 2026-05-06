import type { FormEvent } from 'react'

type LoginViewProps = {
  password: string
  staffName: string
  error: string
  onPasswordChange: (value: string) => void
  onStaffNameChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LoginView({
  password,
  staffName,
  error,
  onPasswordChange,
  onStaffNameChange,
  onSubmit,
}: LoginViewProps) {
  return (
    <section className="login-view">
      <div className="login-panel">
        <div>
          <p className="eyebrow">SALMAN OS / Internal MVP</p>
          <h1>Client operation center</h1>
          <p className="intro">
            SALMAN OS is not a replacement for Google Sheets, Google Drive, or Google Calendar.
            It connects client files, tasks, schedules, business money checks, links, and logs in
            one internal screen.
          </p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            <span>Common password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="salman1!"
            />
          </label>
          <label>
            <span>Your name</span>
            <input
              type="text"
              value={staffName}
              onChange={(event) => onStaffNameChange(event.target.value)}
              placeholder="Salman"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit">Enter SALMAN OS</button>

          <div className="login-notes">
            <p>v1 access: common password + staff name</p>
            <p>v1 calendar: internal schedule only, no Google Calendar sync</p>
            <p>File deletion policy: archive to `99_Archive`, never permanent delete</p>
          </div>
        </form>
      </div>
    </section>
  )
}
