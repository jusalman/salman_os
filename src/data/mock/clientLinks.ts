import type { ClientLink } from '../../types'

export const clientLinksByClientId: Record<string, ClientLink[]> = {
  c1: [
    { id: 'l1', title: '구글 드라이브 원본 폴더', url: 'https://drive.google.com/', category: 'drive' },
    { id: 'l2', title: '네이버 광고 관리자', url: 'https://example.com/admin', category: 'admin' },
    {
      id: 'l3',
      title: '주간 루커 스튜디오 리포트',
      url: 'https://lookerstudio.google.com/reporting/theheim-dental',
      category: 'report',
    },
  ],
  c2: [
    { id: 'l4', title: '구글 드라이브 원본 폴더', url: 'https://drive.google.com/', category: 'drive' },
    {
      id: 'l5',
      title: '광고 운영 체크 시트',
      url: 'https://docs.google.com/spreadsheets/d/barun-clinic-check',
      category: 'report',
    },
  ],
  c3: [{ id: 'l6', title: '구글 드라이브 원본 폴더', url: 'https://drive.google.com/', category: 'drive' }],
}
