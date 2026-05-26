# TASK-93 Drive Backend Adapter Plan

## 목적

SALMAN OS에서 Google Drive를 안전하게 읽고 쓰기 위한 백엔드 adapter 구조를 설계한다.

이 문서는 계획 문서다.

- 코드 구현 없음
- 패키지 설치 없음
- Google SDK 추가 없음
- Google Drive API 호출 없음
- credential 생성 또는 입력 없음
- `.env.local` 수정 없음
- Supabase 연결 없음
- SQL 실행 없음

## 왜 백엔드가 필요한가

Google Drive 파일 관리 기능은 React 브라우저에서 직접 처리하면 안 된다.

이유:

- Google credential이 브라우저에 노출될 수 있다.
- 파일 업로드/이동/보관 작업은 권한 검증과 감사 로그가 필요하다.
- 실패 재시도와 동기화 상태 관리가 필요하다.
- 향후 Shared Drive/service account 구조는 서버에서만 안전하게 다룰 수 있다.

따라서 구조는 아래처럼 잡는다.

```text
React UI
  |
  | SALMAN OS API request
  v
Backend Routes
  |
  | DriveRepository interface
  v
MockDriveRepository or GoogleDriveRepository
  |
  +-- Supabase metadata
  +-- Google Drive API
```

## 현재 앱 구조와의 차이

현재 SALMAN OS는 Vite React 앱 중심이다.

Drive write 기능을 위해서는 별도 backend layer가 필요하다.

후보:

```text
1. 같은 Cloud Run 서비스 안에 Node backend 추가
2. 별도 API 서버 서비스로 분리
3. Supabase Edge Functions 사용
```

초기 권장:

```text
같은 Cloud Run 서비스 안의 Node backend 또는 별도 API 서버
```

이유:

- 파일 업로드, resumable upload, webhook 처리에 더 유연하다.
- Google Drive SDK와 service account credential을 서버에서만 관리하기 쉽다.
- 프론트 빌드와 API route를 한 서비스로 묶거나, 나중에 분리하기 쉽다.

## Adapter 계층

Drive 연동 코드는 직접 route에 쓰지 않는다.

아래 인터페이스로 분리한다.

```text
DriveRepository
- getClientDriveTree(input)
- listClientDriveFiles(input)
- createFolder(input)
- uploadFile(input)
- renameFile(input)
- moveFile(input)
- archiveFile(input)
- syncClientDrive(input)
```

구현체:

```text
MockDriveRepository
GoogleDriveRepository
```

### `MockDriveRepository`

목적:

- Google credential 없이 UI와 backend flow를 검증한다.
- 실제 Drive API 연결 전에도 화면/상태/오류 처리를 개발할 수 있다.
- 테스트에서 안정적인 데이터를 반환한다.

동작:

- 고정 fixture 또는 Supabase mock metadata를 반환한다.
- 파일 추가/폴더 생성/보관 이동은 실제 파일 변경 없이 성공/실패 결과만 흉내낸다.
- action log payload shape를 미리 검증한다.

### `GoogleDriveRepository`

목적:

- 실제 Google Drive API와 통신한다.

활성화 조건:

- server-only credential 준비
- Shared Drive root 확정
- staff role/auth 준비
- read-only sync 승인
- 별도 TASK 승인

v1 초기에는 구현하지 않는다.

## Backend API route 후보

```text
GET    /api/clients/:clientId/drive/tree
GET    /api/clients/:clientId/drive/files?folderId=
POST   /api/clients/:clientId/drive/folders
POST   /api/clients/:clientId/drive/files
PATCH  /api/drive/files/:fileId/rename
PATCH  /api/drive/files/:fileId/move
POST   /api/drive/files/:fileId/archive
POST   /api/clients/:clientId/drive/sync
GET    /api/drive/sync-jobs/:jobId
```

## Request / response shape

### Drive tree

Request:

```text
GET /api/clients/:clientId/drive/tree
```

Response:

```text
{
  "clientId": "uuid",
  "root": {
    "id": "uuid",
    "name": "더하임치과",
    "driveFolderId": "google-folder-id",
    "lastSyncedAt": "2026-05-22T00:00:00.000Z"
  },
  "folders": [
    {
      "id": "uuid",
      "name": "01_Client_Operations",
      "path": "01_Client_Operations/더하임치과",
      "role": "client_operations",
      "readPolicy": "allowed",
      "isArchive": false,
      "fileCount": 12
    }
  ]
}
```

### File list

Request:

```text
GET /api/clients/:clientId/drive/files?folderId=uuid
```

Response:

```text
{
  "clientId": "uuid",
  "folderId": "uuid",
  "files": [
    {
      "id": "uuid",
      "name": "2026년 5월 운영 브리프.pdf",
      "folderPath": "01_Client_Operations/더하임치과",
      "mimeType": "application/pdf",
      "status": "active",
      "syncStatus": "synced",
      "webViewLink": "https://drive.google.com/...",
      "lastModifiedAt": "2026-05-22T00:00:00.000Z"
    }
  ]
}
```

### Folder create

Request:

```text
POST /api/clients/:clientId/drive/folders
{
  "parentFolderId": "uuid",
  "folderName": "04_SA_Operations",
  "folderRole": "sa_operations"
}
```

Response:

```text
{
  "ok": true,
  "folder": {
    "id": "uuid",
    "driveFolderId": "google-folder-id",
    "folderName": "04_SA_Operations"
  }
}
```

### File upload

Request:

```text
POST /api/clients/:clientId/drive/files
multipart/form-data
- folderId
- file
- fileName
```

Response:

```text
{
  "ok": true,
  "file": {
    "id": "uuid",
    "driveFileId": "google-file-id",
    "fileName": "업로드파일.pdf",
    "status": "active"
  }
}
```

### Archive file

Request:

```text
POST /api/drive/files/:fileId/archive
{
  "reason": "이전 자료 보관"
}
```

Response:

```text
{
  "ok": true,
  "file": {
    "id": "uuid",
    "status": "archived",
    "archivedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

## DriveRepository pseudo interface

실제 코드는 다음 TASK에서 결정한다.

```ts
type DriveActor = {
  name: string
  role: 'admin' | 'operator' | 'viewer'
}

type DriveRepository = {
  getClientDriveTree(input: {
    clientId: string
    actor: DriveActor
  }): Promise<ClientDriveTreeResult>

  listClientDriveFiles(input: {
    clientId: string
    folderId?: string
    actor: DriveActor
  }): Promise<ClientDriveFilesResult>

  createFolder(input: {
    clientId: string
    parentFolderId: string
    folderName: string
    folderRole: string
    actor: DriveActor
  }): Promise<DriveFolderMutationResult>

  uploadFile(input: {
    clientId: string
    folderId: string
    fileName: string
    mimeType: string
    contentStream: unknown
    actor: DriveActor
  }): Promise<DriveFileMutationResult>

  renameFile(input: {
    fileId: string
    nextFileName: string
    actor: DriveActor
  }): Promise<DriveFileMutationResult>

  moveFile(input: {
    fileId: string
    nextFolderId: string
    actor: DriveActor
  }): Promise<DriveFileMutationResult>

  archiveFile(input: {
    fileId: string
    reason: string
    actor: DriveActor
  }): Promise<DriveFileMutationResult>

  syncClientDrive(input: {
    clientId: string
    mode: 'manual_full' | 'manual_folder'
    folderId?: string
    actor: DriveActor
  }): Promise<DriveSyncJobResult>
}
```

## Validation rules

모든 write action 전에 검증한다.

### 공통

- `clientId`가 존재해야 한다.
- actor가 있어야 한다.
- actor role이 작업에 맞아야 한다.
- 고객사 Drive root가 등록되어 있어야 한다.

### 폴더 생성

- 폴더명은 비어 있으면 안 된다.
- `/`, `\`, 제어문자 등 위험 문자를 막는다.
- 같은 parent 안의 중복 폴더명을 확인한다.
- 시스템 폴더명은 규칙에 맞아야 한다.

### 파일 업로드

- 파일 크기 제한을 확인한다.
- 허용 확장자를 확인한다.
- 대상 폴더가 `blocked` read policy면 막는다.
- 대상 폴더가 archive면 일반 업로드를 막거나 경고한다.

### 보관 이동

- 이미 archived 상태면 중복 실행하지 않는다.
- archive folder ID가 있어야 한다.
- reason은 선택 또는 필수로 정책화한다.

## Error model

프론트가 이해할 수 있는 오류 코드를 고정한다.

```text
client_not_found
drive_root_missing
folder_not_found
file_not_found
permission_denied
invalid_folder_name
invalid_file_name
file_too_large
unsupported_file_type
drive_api_error
sync_conflict
archive_folder_missing
unknown_error
```

Response 예시:

```text
{
  "ok": false,
  "error": {
    "code": "permission_denied",
    "message": "이 작업을 실행할 권한이 없습니다."
  }
}
```

## Security rules

- Google credential은 server-only 환경에만 둔다.
- `VITE_` 환경변수에 credential을 넣지 않는다.
- action log에 credential, token, file binary를 저장하지 않는다.
- API 응답에 access token을 포함하지 않는다.
- Google Drive file ID는 secret은 아니지만, 무분별하게 노출하지 않는다.
- 모든 write action은 `drive_action_logs`에 남긴다.
- 실제 삭제는 v1에서 제외한다.

## Mock backend flow

초기 구현은 실제 Google API 없이 아래처럼 진행한다.

```text
1. MockDriveRepository 생성
2. mock drive root/folder/file fixture 준비
3. /api/clients/:clientId/drive/tree mock 응답
4. /api/clients/:clientId/drive/files mock 응답
5. create/upload/archive action은 mock mutation으로 응답
6. UI를 local fixture가 아니라 API 응답 기반으로 전환
```

목표:

- UI가 실제 API 구조에 맞춰진다.
- Google credential 없이 개발 가능하다.
- 이후 GoogleDriveRepository로 교체하기 쉽다.

## GoogleDriveRepository flow

실제 구현 시 흐름:

```text
1. server-only credential 로드
2. client_drive_roots에서 root folder ID 조회
3. Google Drive API 호출
4. 결과를 sanitized metadata로 변환
5. Supabase metadata table 갱신
6. drive_action_logs 기록
7. 프론트에 sanitized response 반환
```

## 프론트 변경 방향

현재 `FilesPanel`은 UI 내부에서 샘플 파일 배열을 직접 사용한다.

다음 구현에서는 아래처럼 바꾼다.

```text
FilesPanel
  |
  useClientDrive(clientId)
  |
  backend API
  |
  DriveRepository
```

프론트는 아래만 알면 된다.

- 폴더 목록
- 선택 폴더 ID
- 파일 목록
- 로딩 상태
- 오류 메시지
- 액션 결과

프론트는 Google Drive API 세부사항을 몰라도 된다.

## 테스트 방향

### Unit test

- folder name validation
- file name validation
- permission check
- error mapping
- mock repository behavior

### Integration-like test

- mock API route -> mock repository -> response shape
- archive action -> status changed response
- sync action -> sync job response

### 금지

- 실제 Google Drive API 호출 테스트
- 실제 credential 필요 테스트
- 실제 Supabase 연결 테스트

## 구현 순서

### Step 1. Backend shape 결정

현재 repo에 backend를 어디에 둘지 결정한다.

후보:

```text
server/
api/
src/server/
```

### Step 2. Mock API route 추가

Google API 없이 mock response를 반환한다.

### Step 3. FilesPanel을 API 기반으로 전환

현재 local files 배열 기반에서 backend response 기반으로 이동한다.

### Step 4. Supabase metadata 연동

`drive_*` 테이블 SQL 실행이 승인된 뒤에만 진행한다.

### Step 5. Read-only GoogleDriveRepository

실제 Drive API는 읽기 전용부터 시작한다.

### Step 6. Write action 활성화

폴더 생성, 파일 업로드, 보관 이동 순서로 활성화한다.

## 현재 결론

지금 바로 Google Drive API를 붙이지 않는다.

다음 구현 전에는 아래가 먼저 필요하다.

```text
1. backend 위치 결정
2. mock DriveRepository 구현 계획 확정
3. Drive metadata SQL draft 검토
4. 직원 role/auth 방향 결정
5. read-only sync부터 승인
```

SALMAN OS의 Drive 기능은 프론트 UI가 아니라 backend adapter가 중심이다.
