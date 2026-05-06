import type { ClientLink } from '../../types'

export const clientLinksByClientId: Record<string, ClientLink[]> = {
  c1: [
    { id: 'l1', title: 'Drive Root', url: 'https://drive.google.com/', category: 'drive' },
    { id: 'l2', title: 'Admin Panel', url: 'https://example.com/admin', category: 'admin' },
    {
      id: 'l3',
      title: 'Looker Weekly Report',
      url: 'https://lookerstudio.google.com/reporting/ridge-campaign',
      category: 'report',
    },
  ],
  c2: [
    { id: 'l4', title: 'Drive Root', url: 'https://drive.google.com/', category: 'drive' },
    {
      id: 'l5',
      title: 'Launch Sheet',
      url: 'https://docs.google.com/spreadsheets/d/north-retail-launch',
      category: 'report',
    },
  ],
  c3: [{ id: 'l6', title: 'Drive Root', url: 'https://drive.google.com/', category: 'drive' }],
}
