import type { ClientEvent } from '../../types'

export const clientEventsByClientId: Record<string, ClientEvent[]> = {
  c1: [
    {
      id: 'e1',
      title: '소재 교체 전 내부 검수',
      eventDate: '2026-05-22',
      startTime: '14:00',
      endTime: '14:30',
      owner: '살만',
      status: 'scheduled',
      note: '구글 캘린더가 아닌 SALMAN OS 내부 일정 기준으로만 관리합니다.',
    },
    {
      id: 'e2',
      title: '주간 운영 점검',
      eventDate: '2026-05-25',
      startTime: '10:00',
      endTime: '10:30',
      owner: '민아',
      status: 'scheduled',
      note: '비즈머니, 전환 흐름, 리포트 링크를 함께 확인합니다.',
    },
  ],
  c2: [
    {
      id: 'e3',
      title: '결제 이슈 후속 확인',
      eventDate: '2026-05-23',
      startTime: '11:00',
      endTime: '11:30',
      owner: '민아',
      status: 'scheduled',
      note: '담당자가 결제 수단 정상화 여부를 재확인합니다.',
    },
  ],
  c3: [
    {
      id: 'e4',
      title: '운영 종료 확인 완료',
      eventDate: '2026-05-20',
      startTime: '15:00',
      endTime: '15:20',
      owner: '진우',
      status: 'done',
      note: '종료 고객사 자료 보관 상태를 최종 확인했습니다.',
    },
  ],
}
