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
          <p className="eyebrow">SALMAN OS / 내부 운영센터</p>
          <h1>고객사 운영센터</h1>
          <p className="intro">
            고객사별 자료, 업무, 일정, 비즈머니, 링크, 운영 로그를 한 화면에서 확인하는
            내부 직원용 운영 허브입니다.
          </p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            <span>공통 비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="공통 비밀번호 입력"
            />
          </label>
          <label>
            <span>이름</span>
            <input
              type="text"
              value={staffName}
              onChange={(event) => onStaffNameChange(event.target.value)}
              placeholder="이름 입력"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit">SALMAN OS 입장</button>
        </form>
      </div>
    </section>
  )
}
