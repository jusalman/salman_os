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

export async function handleMockDriveListRoute(
  input: unknown,
  adapter?: DriveServerAdapter,
): Promise<DriveBackendRouteResponse> {
  return handleDriveServerRoute(
    {
      operation: 'list_files',
      body: input,
    },
    adapter,
  )
}

export default async function driveListRoute(
  request: MockDriveApiRequest,
  response: MockDriveApiResponse,
) {
  const result = await handleMockDriveListRoute(readMockDriveRouteInput(request))

  response.status(readMockDriveRouteStatus(result)).json(result)
}

function readMockDriveRouteInput(request: MockDriveApiRequest): unknown {
  return request.body ?? request.query ?? {}
}

function readMockDriveRouteStatus(response: DriveBackendRouteResponse): number {
  return response.ok ? 200 : 400
}
