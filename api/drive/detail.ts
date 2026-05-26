import type { DriveBackendRouteResponse } from '../../src/domain/driveRouteValidation.ts'
import {
  handleDriveServerRouteWithAdapterInput,
  type DriveServerAdapterInput,
} from './driveServerAdapter.ts'

type MockDriveApiRequest = {
  body?: unknown
  query?: unknown
}

type MockDriveApiResponse = {
  status(code: number): {
    json(payload: DriveBackendRouteResponse): void
  }
}

export async function handleMockDriveDetailRoute(
  input: unknown,
  adapterInput?: DriveServerAdapterInput,
): Promise<DriveBackendRouteResponse> {
  return handleDriveServerRouteWithAdapterInput(
    {
      operation: 'get_file',
      body: input,
    },
    adapterInput,
  )
}

export default async function driveDetailRoute(
  request: MockDriveApiRequest,
  response: MockDriveApiResponse,
) {
  const result = await handleMockDriveDetailRoute(readMockDriveRouteInput(request))

  response.status(readMockDriveRouteStatus(result)).json(result)
}

function readMockDriveRouteInput(request: MockDriveApiRequest): unknown {
  return request.body ?? request.query ?? {}
}

function readMockDriveRouteStatus(response: DriveBackendRouteResponse): number {
  if (response.ok) {
    return 200
  }

  return response.error.code === 'file_not_found' ? 404 : 400
}
