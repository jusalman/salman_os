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

export async function handleMockDriveListRoute(
  input: unknown,
  adapterInput?: DriveServerAdapterInput,
): Promise<DriveBackendRouteResponse> {
  return handleDriveServerRouteWithAdapterInput(
    {
      operation: 'list_files',
      body: input,
    },
    adapterInput,
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
