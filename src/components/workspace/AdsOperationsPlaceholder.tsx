import { useState } from 'react'

const adsTabs = [
  {
    label: '전체 광고 현황',
    title: '전체 광고 현황은 준비 중입니다',
    copy: '이후 고객사 Google Sheets 원본 데이터를 기준으로 예산, 성과, 위험 신호를 한 화면에 요약합니다.',
  },
  {
    label: '고객사별 광고 상세',
    title: '고객사별 광고 상세는 준비 중입니다',
    copy: 'SALMAN OS는 네이버 광고에 직접 로그인하지 않고, 고객사 Google Sheets에 정리된 원본 데이터를 읽어 표시합니다.',
  },
  {
    label: 'AI 광고 감사',
    title: 'AI 광고 감사 화면은 준비 중입니다',
    copy: 'v1에서는 자동 실행이나 캠페인 수정 없이, 광고 위험 신호와 점검 결과를 검토용으로 표시하는 방향을 먼저 잡습니다.',
  },
  {
    label: '담당자 액션리스트',
    title: '담당자 액션리스트는 준비 중입니다',
    copy: '광고 점검 결과에서 확인이 필요한 항목을 담당자별 업무로 정리할 예정입니다.',
  },
  {
    label: '고객사 리포트 초안',
    title: '고객사 리포트 초안은 준비 중입니다',
    copy: '광고 현황과 점검 결과를 바탕으로 고객사 공유 전 검토할 초안을 생성하는 화면입니다.',
  },
]

export function AdsOperationsPlaceholder() {
  const [selectedTab, setSelectedTab] = useState(adsTabs[0].label)
  const activeTab = adsTabs.find((tab) => tab.label === selectedTab) ?? adsTabs[0]

  return (
    <section className="ads-operations">
      <header className="topbar">
        <div>
          <p className="eyebrow">고객사 네이버 광고 운영</p>
          <h1>광고 운영</h1>
          <p className="intro">
            고객사 Google Sheets 원본 데이터를 기준으로 광고 현황, 감사 결과, 액션, 리포트
            초안을 확인하는 공간입니다.
          </p>
        </div>
        <div className="topbar-notes">
          <span>데이터 연결 전</span>
          <span>읽기 전용 placeholder</span>
        </div>
      </header>

      <nav className="ads-tabs" aria-label="광고 운영 탭">
        {adsTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={tab.label === selectedTab ? 'ads-tab active' : 'ads-tab'}
            onClick={() => setSelectedTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <article className="panel ads-placeholder-panel">
        <div>
          <p className="eyebrow">준비 중</p>
          <h2>{activeTab.title}</h2>
          <p className="intro">{activeTab.copy}</p>
        </div>
        <div className="ads-placeholder-grid">
          <div>
            <strong>수집 엔진</strong>
            <span>salman-naver-report-auto</span>
          </div>
          <div>
            <strong>원본 저장소</strong>
            <span>고객사 Google Sheets</span>
          </div>
          <div>
            <strong>SALMAN OS 역할</strong>
            <span>시각화 / 감사 / 액션 / 리포트 초안</span>
          </div>
        </div>
      </article>
    </section>
  )
}
