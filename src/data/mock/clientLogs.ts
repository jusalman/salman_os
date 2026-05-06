import type { OperationLog } from '../../types'

export const clientLogsByClientId: Record<string, OperationLog[]> = {
  c1: [
    {
      id: 'o1',
      createdAt: '2026-05-06 08:55',
      actor: 'Salman',
      action: 'checked',
      message: 'Business money flagged as check needed.',
    },
    {
      id: 'o2',
      createdAt: '2026-05-05 16:20',
      actor: 'Mina',
      action: 'updated',
      message: 'Campaign brief uploaded and linked to current tasks.',
    },
    {
      id: 'o3',
      createdAt: '2026-04-29 18:00',
      actor: 'Jin',
      action: 'archived',
      message: 'Old budget draft moved to 99_Archive.',
    },
  ],
  c2: [
    {
      id: 'o4',
      createdAt: '2026-05-06 08:15',
      actor: 'Mina',
      action: 'note',
      message: 'Billing issue noted. Manual check required today.',
    },
    {
      id: 'o5',
      createdAt: '2026-05-01 09:45',
      actor: 'Salman',
      action: 'archived',
      message: 'April asset set moved into 99_Archive.',
    },
  ],
  c3: [
    {
      id: 'o6',
      createdAt: '2026-05-02 15:30',
      actor: 'Jin',
      action: 'updated',
      message: 'Client marked archived and retained for reference.',
    },
  ],
}
