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
        <div className="login-copy">
          <p className="eyebrow">SALMAN OS / 내부 운영센터</p>
          <h1>오늘의 운영을 한눈에.</h1>
          <p className="intro">
            고객사별 업무, 일정, 자료, 비즈머니 상태를 빠르게 확인하는 내부 직원용
            운영센터입니다.
          </p>
          <div className="login-highlights" aria-label="운영센터 주요 항목">
            <span>고객사 현황</span>
            <span>비즈머니 점검</span>
            <span>운영 로그</span>
          </div>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-head">
            <h2>입장하기</h2>
            <p>공통 비밀번호와 작업자 이름을 입력해 주세요.</p>
          </div>
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
            <span>작업자 이름</span>
            <input
              type="text"
              value={staffName}
              onChange={(event) => onStaffNameChange(event.target.value)}
              placeholder="작업자 이름 입력"
            />
            <small>
              작업 기록, 수정 이력, 향후 챗봇 대화 로그에 표시할 이름을 입력하세요.
            </small>
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit">운영센터 열기</button>
        </form>
      </div>
    </section>
  )
}
