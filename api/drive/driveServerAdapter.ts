import type { DriveBackendClient } from '../../src/domain/driveBackendContract.ts'
import {
  handleDriveRouteHarness,
  type DriveRouteHandlerHarnessRequest,
} from '../../src/data/adapters/mock/driveRouteFakeHandler.ts'
import { driveBackendFakeClient } from '../../src/data/adapters/mock/driveBackendFakeClient.ts'
import type { DriveBackendRouteResponse } from '../../src/domain/driveRouteValidation.ts'

export type DriveServerAdapter = DriveBackendClient

export const fakeDriveServerAdapter: DriveServerAdapter = driveBackendFakeClient

export function createFakeDriveServerAdapter(): DriveServerAdapter {
  return fakeDriveServerAdapter
}

export async function handleDriveServerRoute(
  request: DriveRouteHandlerHarnessRequest,
  adapter: DriveServerAdapter = fakeDriveServerAdapter,
): Promise<DriveBackendRouteResponse> {
  return handleDriveRouteHarness(request, adapter)
}
