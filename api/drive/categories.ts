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

export async function handleMockDriveCategoriesRoute(
  input: unknown,
  adapterInput?: DriveServerAdapterInput,
): Promise<DriveBackendRouteResponse> {
  return handleDriveServerRouteWithAdapterInput(
    {
      operation: 'list_categories',
      body: input,
    },
    adapterInput,
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
