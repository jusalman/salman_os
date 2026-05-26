import { evaluateGoogleDriveLocalSmokeGate } from '../api/drive/googleDriveLocalSmokeGate.ts'

const report = evaluateGoogleDriveLocalSmokeGate(process.env)

console.log(report.message)
console.log(`Required settings: ${report.requiredEnvNames.join(', ')}`)

if (!report.ok) {
  if (report.missingEnvNames.length > 0) {
    console.log(`Missing settings: ${report.missingEnvNames.join(', ')}`)
  }

  if (report.invalidEnvNames.length > 0) {
    console.log(`Invalid settings: ${report.invalidEnvNames.join(', ')}`)
  }

  if (report.forbiddenPublicEnvNames.length > 0) {
    console.log(`Forbidden public settings: ${report.forbiddenPublicEnvNames.join(', ')}`)
  }

  process.exitCode = 1
}
