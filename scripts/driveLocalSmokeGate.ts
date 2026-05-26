import {
  evaluateGoogleDriveLocalSmokeGate,
  formatGoogleDriveLocalSmokeGateReport,
} from '../api/drive/googleDriveLocalSmokeGate.ts'
import {
  formatGoogleDriveLocalSmokeEnvLoadReport,
  loadGoogleDriveLocalSmokeEnv,
} from '../api/drive/googleDriveLocalSmokeEnv.ts'

const envLoad = loadGoogleDriveLocalSmokeEnv(process.env)

for (const line of formatGoogleDriveLocalSmokeEnvLoadReport(envLoad)) {
  console.log(line)
}

const report = evaluateGoogleDriveLocalSmokeGate(envLoad.env)

for (const line of formatGoogleDriveLocalSmokeGateReport(report)) {
  console.log(line)
}

if (!envLoad.ok || !report.ok) {
  process.exitCode = 1
}
