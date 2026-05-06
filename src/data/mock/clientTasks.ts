import type { ClientTask } from '../../types'

export const clientTasksByClientId: Record<string, ClientTask[]> = {
  c1: [
    {
      id: 't1',
      title: 'Confirm creative approval',
      status: 'doing',
      priority: 'high',
      dueDate: '2026-05-06',
      assignee: 'Salman',
      relatedFileId: 'f2',
      note: 'Need final OK before 14:00.',
    },
    {
      id: 't2',
      title: 'Update weekly report links',
      status: 'done',
      priority: 'normal',
      dueDate: '2026-05-05',
      assignee: 'Mina',
      relatedFileId: 'f1',
      note: 'Drive links synced into client view.',
    },
    {
      id: 't3',
      title: 'Replace outdated budget draft',
      status: 'archived',
      priority: 'low',
      dueDate: '2026-04-29',
      assignee: 'Jin',
      relatedFileId: 'f3',
      note: 'Moved old version to 99_Archive.',
    },
  ],
  c2: [
    {
      id: 't4',
      title: 'Resolve overdue launch QA',
      status: 'blocked',
      priority: 'high',
      dueDate: '2026-05-04',
      assignee: 'Mina',
      relatedFileId: 'f4',
      note: 'Waiting for missing product copy.',
    },
    {
      id: 't5',
      title: 'Archive old asset bundle',
      status: 'done',
      priority: 'low',
      dueDate: '2026-05-01',
      assignee: 'Salman',
      relatedFileId: 'f5',
      note: 'Completed as archive-only, not deleted.',
    },
  ],
  c3: [
    {
      id: 't6',
      title: 'Close remaining notes',
      status: 'archived',
      priority: 'low',
      dueDate: '2026-05-02',
      assignee: 'Jin',
      note: 'Project paused, no active action left.',
    },
  ],
}
