import type { ClientMoneyItem } from '../../types'

export const clientMoneyItemsByClientId: Record<string, ClientMoneyItem[]> = {
  c1: [
    {
      id: 'm1',
      title: 'Ad account business money',
      url: 'https://business.google.com/',
      status: 'check_needed',
      lastCheckedAt: '2026-05-05 17:40',
      checkedBy: 'Salman',
      note: 'Balance looks low. Recheck before tonight.',
    },
    {
      id: 'm2',
      title: 'Backup payment method',
      url: 'https://payments.google.com/',
      status: 'checked',
      lastCheckedAt: '2026-05-05 11:20',
      checkedBy: 'Mina',
      note: 'No issue found.',
    },
  ],
  c2: [
    {
      id: 'm3',
      title: 'Store ads billing check',
      url: 'https://business.google.com/',
      status: 'issue',
      lastCheckedAt: '2026-05-06 08:05',
      checkedBy: 'Mina',
      note: 'Primary card declined. Manual follow-up required.',
    },
  ],
  c3: [
    {
      id: 'm4',
      title: 'Final billing record',
      url: 'https://payments.google.com/',
      status: 'checked',
      lastCheckedAt: '2026-05-02 15:25',
      checkedBy: 'Jin',
      note: 'No pending balance.',
    },
  ],
}
