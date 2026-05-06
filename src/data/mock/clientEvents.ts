import type { ClientEvent } from '../../types'

export const clientEventsByClientId: Record<string, ClientEvent[]> = {
  c1: [
    {
      id: 'e1',
      title: 'Creative review',
      eventDate: '2026-05-06',
      startTime: '14:00',
      endTime: '14:30',
      owner: 'Salman',
      status: 'scheduled',
      note: 'Internal client review only. No Google Calendar sync.',
    },
    {
      id: 'e2',
      title: 'Weekly ops check',
      eventDate: '2026-05-08',
      startTime: '10:00',
      endTime: '10:30',
      owner: 'Mina',
      status: 'scheduled',
      note: 'Supabase-based internal schedule.',
    },
  ],
  c2: [
    {
      id: 'e3',
      title: 'Launch QA handoff',
      eventDate: '2026-05-07',
      startTime: '11:00',
      endTime: '11:30',
      owner: 'Mina',
      status: 'scheduled',
      note: 'Internal schedule record in Supabase model.',
    },
  ],
  c3: [
    {
      id: 'e4',
      title: 'Pause review complete',
      eventDate: '2026-05-02',
      startTime: '15:00',
      endTime: '15:20',
      owner: 'Jin',
      status: 'done',
      note: 'Recorded internally only.',
    },
  ],
}
