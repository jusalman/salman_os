# TASK-91 Drive Metadata Schema Plan

## 목적

SALMAN OS에서 Google Drive 폴더와 파일을 안정적으로 관리하기 위한 Supabase 메타데이터 구조를 설계한다.

이 문서는 SQL 실행 전 설계 문서다.

- SQL 실행 없음
- 실제 Supabase 연결 없음
- 실제 Google Drive API 연결 없음
- 실제 credential 생성 없음
- 실제 `.env.local` 수정 없음
- 기존 테이블 마이그레이션 실행 없음

## 핵심 원칙

Google Drive와 Supabase의 역할을 섞지 않는다.

```text
Google Drive
- 실제 파일 원본
- 실제 폴더 구조
- 실제 파일 ID와 폴더 ID
- 실제 업로드/이동/보관 결과

Supabase
- 고객사와 Drive 파일의 연결 정보
- Drive 파일/폴더 메타데이터 캐시
- 동기화 상태
- 작업 로그
- SALMAN OS 화면 표시용 정리 데이터
```

파일 바이너리는 Supabase에 저장하지 않는다.

## 현재 `client_files`와의 관계

현재 schema draft에는 `client_files`가 있다.

현재 역할:

- 고객사별 Drive URL과 파일명 표시
- 간단한 파일 링크 관리
- v1 운영 화면용 최소 파일 메타데이터

Drive API 연동 이후에는 아래 둘 중 하나로 정리해야 한다.

### 권장안: Drive 전용 테이블을 새로 추가

`client_files`는 기존 v1 호환용으로 유지하고, 실제 Drive API 연동은 `drive_files`와 `drive_folders`가 담당한다.

장점:

- 기존 v1 기능을 깨지 않는다.
- Drive sync 전용 상태값을 분리할 수 있다.
- Google Drive API의 복잡한 메타데이터를 `client_files`에 억지로 넣지 않아도 된다.

단점:

- 초기에는 `client_files`와 `drive_files`가 일부 중복된다.

정리 방향:

- v1 화면은 점진적으로 `drive_files` 기반 read model로 이동한다.
- 필요하면 나중에 `client_files`를 호환 view로 바꿀 수 있다.

## 테이블 구성

권장 테이블:

```text
client_drive_roots
drive_folders
drive_files
drive_sync_jobs
drive_action_logs
```

선택 후보:

```text
drive_action_queue
```

`drive_action_queue`는 비동기 업로드/대용량 이동 작업이 필요할 때만 추가한다.

## Enum 후보

SQL 초안 작성 시 enum 또는 check constraint로 선택한다.

### `drive_root_kind`

```text
shared_drive
my_drive
external_folder
```

권장 기본값:

```text
shared_drive
```

### `drive_folder_role`

```text
client_root
governance
client_operations
sa_operations
da_operations
creative_assets
landing_tracking
reports
admin_finance_legal
inbox
archive
other
```

### `drive_file_status`

```text
active
archived
missing_in_drive
trashed
deleted
```

v1 권장:

- `active`
- `archived`
- `missing_in_drive`

`trashed`, `deleted`는 read-only 감지용 또는 관리자 전용 future state로 둔다.

### `drive_sync_status`

```text
synced
pending_create
pending_upload
pending_move
pending_archive
missing_in_drive
conflict
error
```

### `drive_sync_job_status`

```text
queued
running
completed
failed
cancelled
```

### `drive_action_type`

```text
create_folder
upload_file
rename_file
move_file
archive_file
sync_scan
external_change_detected
restore_file
open_file
```

### `drive_read_policy`

미래 AI/RAG를 대비한 읽기 정책이다.

```text
allowed
restricted
blocked
```

v1에서는 AI/RAG를 실행하지 않는다.

다만 나중에 Drive 전체 색인을 할 때 어떤 자료를 읽어도 되는지 구분하려면 지금부터 메타데이터를 남기는 것이 좋다.

## `client_drive_roots`

고객사와 Google Drive 루트 폴더를 연결하는 테이블이다.

### 목적

- 고객사별 Drive root folder ID 저장
- Shared Drive ID 저장
- 고객사 Drive 동기화 활성화 여부 저장
- 보관 폴더 ID 저장

### 필드 후보

```text
id uuid primary key
client_id uuid references clients(id)
drive_root_kind drive_root_kind
drive_id text
root_folder_id text
root_folder_name text
root_folder_path text
archive_folder_id text
inbox_folder_id text
sync_enabled boolean
last_synced_at timestamptz
created_at timestamptz
updated_at timestamptz
```

### 제약 후보

```text
unique(client_id)
unique(root_folder_id)
```

### 메모

- Google Drive file/folder ID는 UUID가 아니라 text다.
- `drive_id`는 Shared Drive 기준 식별자다.
- 고객사별 root는 하나만 두는 것을 v1 기준으로 권장한다.

## `drive_folders`

Drive 폴더 구조 캐시다.

### 목적

- 화면의 왼쪽 폴더 트리 표시
- 폴더별 파일 필터링
- 보관 폴더, 임시 폴더, AI 읽기 금지 폴더 구분
- Drive sync 기준점 제공

### 필드 후보

```text
id uuid primary key
client_id uuid references clients(id)
client_drive_root_id uuid references client_drive_roots(id)
drive_folder_id text
parent_id uuid references drive_folders(id)
parent_drive_folder_id text
folder_name text
folder_path text
folder_role drive_folder_role
read_policy drive_read_policy
is_archive boolean
is_system_folder boolean
sync_status drive_sync_status
last_seen_at timestamptz
created_at timestamptz
updated_at timestamptz
```

### 제약 후보

```text
unique(drive_folder_id)
unique(client_id, folder_path)
```

### 인덱스 후보

```text
index(client_id, parent_id)
index(client_id, folder_role)
index(client_id, sync_status)
```

### 메모

- `parent_id`는 Supabase 내부 폴더 레코드 연결용이다.
- `parent_drive_folder_id`는 Google Drive 원본 parent ID 캐시다.
- 둘 다 두면 sync/복구/디버깅이 쉬워진다.

## `drive_files`

Drive 파일 메타데이터 캐시다.

### 목적

- 화면의 오른쪽 파일 목록 표시
- 파일 상태와 Drive 원본 링크 연결
- 보관 이동 상태 관리
- 외부 Drive 변경 감지
- 향후 AI/RAG 읽기 정책 연결

### 필드 후보

```text
id uuid primary key
client_id uuid references clients(id)
client_drive_root_id uuid references client_drive_roots(id)
folder_id uuid references drive_folders(id)
drive_file_id text
drive_folder_id text
file_name text
file_extension text
mime_type text
web_view_link text
web_content_link text
size_bytes bigint
checksum_md5 text
owner_email text
last_modified_at timestamptz
last_seen_at timestamptz
file_status drive_file_status
sync_status drive_sync_status
read_policy drive_read_policy
archived_at timestamptz
archive_reason text
created_at timestamptz
updated_at timestamptz
```

### 제약 후보

```text
unique(drive_file_id)
unique(client_id, drive_file_id)
```

### 인덱스 후보

```text
index(client_id, folder_id)
index(client_id, file_status)
index(client_id, sync_status)
index(client_id, read_policy)
index(last_modified_at)
index(last_seen_at)
```

### 메모

- Google Docs/Sheets/Slides는 일반 파일과 MIME type이 다르다.
- Google-native 파일은 `size_bytes`나 checksum이 없을 수 있다.
- `web_view_link`는 사용자가 브라우저에서 여는 링크다.
- `web_content_link`는 다운로드 가능한 파일에만 의미가 있을 수 있다.

## `drive_sync_jobs`

Drive 동기화 실행 기록이다.

### 목적

- 동기화 실행 여부 확인
- 실패 원인 추적
- 대량 파일 스캔 결과 통계 저장
- 수동/자동 동기화 구분

### 필드 후보

```text
id uuid primary key
client_id uuid references clients(id)
client_drive_root_id uuid references client_drive_roots(id)
requested_by_name text
job_status drive_sync_job_status
sync_mode text
started_at timestamptz
finished_at timestamptz
scanned_folder_count integer
scanned_file_count integer
created_count integer
updated_count integer
archived_count integer
missing_count integer
conflict_count integer
error_count integer
error_message text
created_at timestamptz
updated_at timestamptz
```

### `sync_mode` 후보

```text
manual_full
manual_folder
scheduled_full
incremental
webhook_change
```

### 인덱스 후보

```text
index(client_id, created_at desc)
index(job_status, created_at desc)
```

## `drive_action_logs`

Drive 관련 사용자/시스템 액션 감사 로그다.

### 목적

- 누가 어떤 파일을 만들고 이동하고 보관했는지 추적
- Drive API 실패 기록
- 외부 Drive 변경 감지 기록
- 운영 사고 대응

### 필드 후보

```text
id uuid primary key
client_id uuid references clients(id)
client_drive_root_id uuid references client_drive_roots(id)
folder_id uuid references drive_folders(id)
file_id uuid references drive_files(id)
drive_folder_id text
drive_file_id text
action_type drive_action_type
actor_name text
actor_role text
result_status text
before_payload jsonb
after_payload jsonb
error_message text
created_at timestamptz
```

### `result_status` 후보

```text
success
failed
blocked
pending
```

### 인덱스 후보

```text
index(client_id, created_at desc)
index(file_id, created_at desc)
index(action_type, created_at desc)
```

## 선택 후보: `drive_action_queue`

대용량 업로드, 대량 이동, 대량 동기화가 필요하면 action log와 별도로 queue가 필요하다.

v1 초기에는 필수는 아니다.

필드 후보:

```text
id uuid primary key
client_id uuid references clients(id)
action_type drive_action_type
requested_by_name text
request_payload jsonb
queue_status text
attempt_count integer
last_error_message text
scheduled_at timestamptz
started_at timestamptz
finished_at timestamptz
created_at timestamptz
updated_at timestamptz
```

## 관계도

```text
clients
  |
  +-- client_drive_roots
        |
        +-- drive_folders
        |     |
        |     +-- drive_files
        |
        +-- drive_sync_jobs
        |
        +-- drive_action_logs
```

파일은 고객사와 직접 연결하면서 동시에 폴더와도 연결한다.

이유:

- 고객사 기준 조회가 빠르다.
- 폴더 기준 조회도 가능하다.
- 폴더 정보가 깨져도 파일의 고객사 소속은 유지할 수 있다.

## 화면 read model

고객사 상세 Google Drive 패널에는 아래 shape가 필요하다.

```text
DriveRootView
- clientId
- rootFolderName
- rootFolderPath
- lastSyncedAt
- folders[]
- files[]
- syncStatus
```

폴더:

```text
DriveFolderView
- id
- name
- path
- role
- readPolicy
- fileCount
- isArchive
```

파일:

```text
DriveFileView
- id
- name
- folderPath
- mimeType
- fileExtension
- status
- syncStatus
- webViewLink
- ownerName
- lastModifiedAt
```

## RPC / API read surface 후보

프론트에서 base table을 직접 읽지 않는 방향을 유지한다.

후보:

```text
public.get_client_drive_tree_v1(client_id uuid)
public.get_client_drive_files_v1(client_id uuid, folder_id uuid default null)
public.get_client_drive_sync_status_v1(client_id uuid)
```

다만 실제 Drive API 쓰기 작업은 Supabase RPC가 아니라 SALMAN OS 백엔드 API에서 처리하는 것이 맞다.

이유:

- Google credential은 서버에 있어야 한다.
- 파일 업로드는 HTTP multipart/resumable 처리와 연결된다.
- Drive API 실패 재시도와 로그 처리가 필요하다.

## RLS / 권한 방향

현재 v1 로그인은 공통 비밀번호 + 이름 입력이다.

실제 Drive write 기능을 켜기 전에는 직원 인증과 역할 관리가 필요하다.

권장:

- anon은 base table 직접 select 금지
- 화면 read는 제한된 RPC 또는 백엔드 API로 제공
- Drive write는 백엔드 API에서만 실행
- 모든 write action은 `drive_action_logs`에 기록
- `drive_action_logs`는 삭제하지 않는다

역할 후보:

```text
admin
operator
viewer
```

작업 권한 후보:

```text
admin:
- 폴더 생성
- 파일 업로드
- 파일명 변경
- 파일 이동
- 보관 이동
- 동기화 실행

operator:
- 파일 업로드
- 보관 이동 요청
- 동기화 실행

viewer:
- 읽기만 가능
```

## 기존 `client_files` 마이그레이션 방향

초기에는 기존 `client_files`를 그대로 둔다.

Drive API 연동 후에는 아래 순서로 이동한다.

```text
1. client_files 기존 데이터 유지
2. drive_files / drive_folders 추가
3. read model에서 drive_files 우선 사용
4. 기존 client_files는 수동 링크 또는 legacy file link로 분리
5. 필요하면 client_files 호환 view를 별도 설계
```

기존 `client_files`를 바로 삭제하거나 교체하지 않는다.

## Sync 규칙

### Full sync

고객사 root folder 아래 전체 폴더와 파일을 스캔한다.

사용 시점:

- 최초 연결
- 폴더 구조가 크게 바뀐 후
- 수동 재동기화

### Folder sync

특정 폴더만 다시 읽는다.

사용 시점:

- 사용자가 폴더를 클릭했을 때
- 파일 추가 후 해당 폴더만 갱신할 때

### Incremental sync

변경사항 기반으로 갱신한다.

사용 시점:

- 정식 백엔드와 webhook 준비 후
- 대량 파일 운영이 많아졌을 때

## 보관 정책

삭제 대신 보관을 기본으로 한다.

보관 이동 시:

```text
drive_files.file_status = archived
drive_files.sync_status = synced
drive_files.archived_at = now()
drive_files.archive_reason = user input or system reason
```

Drive에서는:

```text
기존 folder parent 제거
99_Archive folder parent 추가
```

휴지통 이동이나 영구 삭제는 v1에서 제외한다.

## 구현 순서

### Step 1. Schema SQL draft

이 문서를 기반으로 SQL draft를 만든다.

주의:

- SQL 실행하지 않는다.
- 실제 Supabase 연결하지 않는다.

### Step 2. Mock Drive backend adapter

Google API 없이 서버 인터페이스만 먼저 만든다.

목표:

- UI가 실제 backend shape에 맞게 움직이는지 확인
- 구글 credential 없이 개발 가능

### Step 3. Read-only Drive sync

실제 Google Drive API는 읽기 전용으로만 붙인다.

목표:

- 고객사 root folder 조회
- folder/file list 읽기
- Supabase metadata cache 저장

### Step 4. Write action activation

아래 순서로 켠다.

```text
1. 폴더 생성
2. 파일 업로드
3. 파일명 변경
4. 파일 이동
5. 보관 이동
```

각 단계마다 audit log와 rollback 기준을 확인한다.

## 구현 전 확인 필요

1. `SALMAN_OS_DRIVE`를 Shared Drive로 만들 것인가?
2. 고객사별 root folder ID를 누가 최초 등록할 것인가?
3. 직원 인증을 어떤 방식으로 확장할 것인가?
4. Drive write 권한을 admin/operator 중 누구에게 줄 것인가?
5. 보관 이동 시 전역 `99_Archive`를 쓸 것인가, 고객사별 archive folder를 쓸 것인가?
6. Google-native 파일과 일반 업로드 파일을 화면에서 구분할 것인가?
7. 파일명 규칙 위반 파일은 막을 것인가, 경고만 띄울 것인가?

## 현재 결론

Drive API 연동을 위해서는 기존 `client_files`만으로는 부족하다.

따라서 아래 구조를 추가하는 방향이 맞다.

```text
client_drive_roots
drive_folders
drive_files
drive_sync_jobs
drive_action_logs
```

다음 작업은 이 문서를 기반으로 **실행하지 않는 SQL draft**를 작성하는 것이다.
