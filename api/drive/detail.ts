import type { DriveBackendRouteResponse } from '../../src/domain/driveRouteValidation.ts'
import { handleDriveServerRoute, type DriveServerAdapter } from './driveServerAdapter.ts'

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
  adapter?: DriveServerAdapter,
): Promise<DriveBackendRouteResponse> {
  return handleDriveServerRoute(
    {
      operation: 'get_file',
      body: input,
    },
    adapter,
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
