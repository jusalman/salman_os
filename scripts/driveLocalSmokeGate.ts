import {
  evaluateGoogleDriveLocalSmokeGate,
  formatGoogleDriveLocalSmokeGateReport,
} from '../api/drive/googleDriveLocalSmokeGate.ts'

const report = evaluateGoogleDriveLocalSmokeGate(process.env)

for (const line of formatGoogleDriveLocalSmokeGateReport(report)) {
  console.log(line)
}

if (!report.ok) {
  process.exitCode = 1
}
