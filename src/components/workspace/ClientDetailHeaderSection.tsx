import type { ClientDetailHeaderModel } from '../../types'
import { ClientDetailHeader } from './ClientDetailHeader'

type ClientDetailHeaderSectionProps = {
  client: ClientDetailHeaderModel
}

export function ClientDetailHeaderSection({ client }: ClientDetailHeaderSectionProps) {
  return <ClientDetailHeader client={client} />
}
