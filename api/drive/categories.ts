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

export async function handleMockDriveCategoriesRoute(
  input: unknown,
  adapter?: DriveServerAdapter,
): Promise<DriveBackendRouteResponse> {
  return handleDriveServerRoute(
    {
      operation: 'list_categories',
      body: input,
    },
    adapter,
  )
}

export default async function driveCategoriesRoute(
  request: MockDriveApiRequest,
  response: MockDriveApiResponse,
) {
  const result = await handleMockDriveCategoriesRoute(readMockDriveRouteInput(request))

  response.status(readMockDriveRouteStatus(result)).json(result)
}

function readMockDriveRouteInput(request: MockDriveApiRequest): unknown {
  return request.body ?? request.query ?? {}
}

function readMockDriveRouteStatus(response: DriveBackendRouteResponse): number {
  return response.ok ? 200 : 400
}
