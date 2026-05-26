import { runGoogleDriveListSmoke } from '../api/drive/googleDriveListSmoke.ts'

const result = await runGoogleDriveListSmoke(process.env)

for (const line of result.lines) {
  console.log(line)
}

if (!result.ok) {
  process.exitCode = 1
}
