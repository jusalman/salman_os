import type { OperationLog } from '../../types'

export const clientLogsByClientId: Record<string, OperationLog[]> = {
  c1: [
    {
      id: 'o1',
      createdAt: '2026-05-22 08:55',
      actor: '살만',
      action: '확인',
      message: '비즈머니 잔액이 낮아 확인 필요 상태로 표시했습니다.',
    },
    {
      id: 'o2',
      createdAt: '2026-05-21 16:20',
      actor: '민아',
      action: '업데이트',
      message: '운영 브리프 파일을 업로드하고 진행 업무와 연결했습니다.',
    },
    {
      id: 'o3',
      createdAt: '2026-05-14 18:00',
      actor: '진우',
      action: '보관',
      message: '이전 예산안을 삭제하지 않고 보관함으로 이동했습니다.',
    },
  ],
  c2: [
    {
      id: 'o4',
      createdAt: '2026-05-22 08:15',
      actor: '민아',
      action: '메모',
      message: '결제 오류가 확인되어 오늘 수동 후속 확인이 필요합니다.',
    },
    {
      id: 'o5',
      createdAt: '2026-05-20 09:45',
      actor: '살만',
      action: '보관',
      message: '지난달 소재 묶음을 보관함에 정리했습니다.',
    },
  ],
  c3: [
    {
      id: 'o6',
      createdAt: '2026-05-20 15:30',
      actor: '진우',
      action: '업데이트',
      message: '운영 종료 고객사로 전환하고 참고 자료만 보관했습니다.',
    },
  ],
}
