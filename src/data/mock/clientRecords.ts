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
    name: 'Ridge Campaign',
    status: 'active',
    owner: 'Salman',
    driveRootUrl: 'https://drive.google.com/',
    memo: 'Weekly ad performance check and creative rotation in progress.',
    updatedAt: '2026-05-06 09:40',
  },
  {
    id: 'c2',
    name: 'North Retail',
    status: 'attention',
    owner: 'Mina',
    driveRootUrl: 'https://drive.google.com/',
    memo: 'Billing confirmation and overdue task need attention.',
    updatedAt: '2026-05-06 08:15',
  },
  {
    id: 'c3',
    name: 'Aster Studio',
    status: 'archived',
    owner: 'Jin',
    driveRootUrl: 'https://drive.google.com/',
    memo: 'Client paused. Kept for reference and archive access.',
    updatedAt: '2026-05-02 15:30',
  },
]
