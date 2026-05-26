import { runGoogleDriveListSmoke } from '../api/drive/googleDriveListSmoke.ts'
import {
  formatGoogleDriveLocalSmokeEnvLoadReport,
  loadGoogleDriveLocalSmokeEnv,
} from '../api/drive/googleDriveLocalSmokeEnv.ts'

const envLoad = loadGoogleDriveLocalSmokeEnv(process.env)

for (const line of formatGoogleDriveLocalSmokeEnvLoadReport(envLoad)) {
  console.log(line)
}

if (!envLoad.ok) {
  process.exitCode = 1
} else {
  const result = await runGoogleDriveListSmoke(envLoad.env)

  for (const line of result.lines) {
    console.log(line)
  }

  if (!result.ok) {
    process.exitCode = 1
  }
}
