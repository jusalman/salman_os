type ClientSeedRecord = {
  id: string
  name: string
  status: 'active' | 'attention' | 'archived'
  owner: string
  driveRootUrl: string
  memo: string
  updatedAt: string
}

export const clientRecords: ClientSeedRecord[] = [
  {
    id: 'c1',
    name: '더하임치과',
    status: 'active',
    owner: '살만',
    driveRootUrl: 'https://drive.google.com/',
    memo: 'SA 검색광고와 랜딩 전환을 주간 단위로 점검하는 핵심 운영 고객사입니다.',
    updatedAt: '2026-05-22 09:40',
  },
  {
    id: 'c2',
    name: '바른약속의원',
    status: 'attention',
    owner: '민아',
    driveRootUrl: 'https://drive.google.com/',
    memo: '비즈머니와 소재 승인 상태를 오늘 안에 확인해야 하는 주의 고객사입니다.',
    updatedAt: '2026-05-22 08:15',
  },
  {
    id: 'c3',
    name: '오브제스튜디오',
    status: 'archived',
    owner: '진우',
    driveRootUrl: 'https://drive.google.com/',
    memo: '운영이 종료되어 참고 자료와 계약 기록만 보관 중인 고객사입니다.',
    updatedAt: '2026-05-20 15:30',
  },
]
