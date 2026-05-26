import type { ClientTask } from '../../types'

export const clientTasksByClientId: Record<string, ClientTask[]> = {
  c1: [
    {
      id: 't1',
      title: '신규 검색광고 소재 최종 승인',
      status: 'doing',
      priority: 'high',
      dueDate: '2026-05-22',
      assignee: '살만',
      relatedFileId: 'f2',
      note: '오후 진료 시간 전까지 대표 키워드 소재 문구를 최종 확인해야 합니다.',
    },
    {
      id: 't2',
      title: '주간 리포트 링크 업데이트',
      status: 'done',
      priority: 'normal',
      dueDate: '2026-05-21',
      assignee: '민아',
      relatedFileId: 'f1',
      note: '구글 드라이브 리포트와 루커 스튜디오 링크를 운영 화면에 반영했습니다.',
    },
    {
      id: 't3',
      title: '이전 예산안 보관 처리',
      status: 'archived',
      priority: 'low',
      dueDate: '2026-05-14',
      assignee: '진우',
      relatedFileId: 'f3',
      note: '사용하지 않는 예산안은 삭제하지 않고 보관함으로 이동했습니다.',
    },
  ],
  c2: [
    {
      id: 't4',
      title: '비즈머니 결제 오류 확인',
      status: 'blocked',
      priority: 'high',
      dueDate: '2026-05-22',
      assignee: '민아',
      relatedFileId: 'f4',
      note: '카드 승인 실패로 광고 노출 중단 가능성이 있어 결제 수단 확인이 필요합니다.',
    },
    {
      id: 't5',
      title: '지난달 소재 묶음 보관',
      status: 'done',
      priority: 'low',
      dueDate: '2026-05-20',
      assignee: '살만',
      relatedFileId: 'f5',
      note: '지난달 배너와 문구 파일을 보관함으로 정리했습니다.',
    },
  ],
  c3: [
    {
      id: 't6',
      title: '종료 고객사 메모 정리',
      status: 'archived',
      priority: 'low',
      dueDate: '2026-05-20',
      assignee: '진우',
      note: '계약 종료 후 참고할 운영 이력만 보관 상태로 남겨두었습니다.',
    },
  ],
}
