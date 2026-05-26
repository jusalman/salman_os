# TASK-90 Google Drive API Sync Architecture

## 목적

SALMAN OS 안에서 고객사별 Google Drive 폴더와 파일을 보고, 추가하고, 보관하고, 동기화할 수 있는 구조를 설계한다.

이 문서는 구현 전 설계 문서다.

- 실제 Google Drive API 연결 없음
- 실제 credential 생성 없음
- 실제 `.env.local` 수정 없음
- 실제 파일 업로드/삭제/이동 없음
- SQL 실행 없음
- Supabase/RLS/RPC 변경 없음
- OpenAI API 또는 RAG 구현 없음

## 제품 방향

SALMAN OS의 Google Drive 기능은 단순 링크 모음이 아니다.

목표는 아래와 같다.

- 고객사 상세 화면에서 Drive 폴더 구조를 바로 확인한다.
- 고객사별 운영 파일을 폴더 트리와 파일 목록으로 보여준다.
- 파일 추가, 폴더 생성, 보관 이동, 동기화를 SALMAN OS에서 실행한다.
- 실행 결과는 실제 Google Drive에도 반영된다.
- Supabase에는 파일 원본이 아니라 Drive 메타데이터와 운영 상태만 저장한다.

Google Drive는 원본 파일 저장소다.

Supabase는 SALMAN OS 운영 데이터 기준 저장소다.

## 기준 구조

권장 구조는 회사 개인 Drive가 아니라 **Google Shared Drive**를 기준으로 한다.

이유:

- 개인 계정 퇴사/변경에 덜 취약하다.
- 고객사 자료의 소유권을 회사 단위로 유지하기 쉽다.
- 서비스 계정 또는 관리자 계정 기반 자동화 구조와 맞다.
- 장기적으로 AI/RAG 색인 대상 폴더를 분리하기 쉽다.

Drive 루트 예시:

```text
SALMAN_OS_DRIVE/
|-- 00_Governance_Index/
|-- 01_Client_Operations/
|-- 04_SA_Operations/
|-- 05_DA_Operations/
|-- 06_Creative_Assets/
|-- 08_Reports_Insights/
|-- 12_Admin_Finance_Legal/
|-- 90_Inbox/
+-- 99_Archive/
```

고객사 폴더는 `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md`의 규칙을 따른다.

## 전체 시스템 구조

```text
SALMAN OS Browser
  |
  | UI action
  v
SALMAN OS Backend API
  |
  | server-only credential
  v
Google Drive API
  |
  | file/folder source of truth
  v
Google Drive

SALMAN OS Backend API
  |
  | metadata cache, audit, client relation
  v
Supabase
```

중요 원칙:

- React 브라우저 코드에서 Google credential을 직접 다루지 않는다.
- `VITE_` 환경변수에 Google credential을 넣지 않는다.
- Drive API 호출은 서버/백엔드에서만 실행한다.
- Supabase에는 Drive 파일 원본을 저장하지 않는다.
- 파일 삭제는 기본적으로 금지하고, `99_Archive` 이동을 기본 액션으로 둔다.

## 인증 방식 선택지

### 1안: Google OAuth 사용자 승인 방식

직원이 Google 계정으로 로그인하고, 본인이 접근 권한을 가진 Drive 파일을 관리하는 방식이다.

장점:

- 사용자별 권한 추적이 쉽다.
- 초기 보안 부담이 상대적으로 낮다.
- 직원이 직접 선택한 파일 또는 앱이 만든 파일 중심으로 운영하기 좋다.

단점:

- 직원별 권한 차이에 따라 화면 결과가 달라질 수 있다.
- 회사 전체 Drive를 자동으로 구조화/동기화하기 어렵다.
- 직원이 퇴사하거나 권한이 바뀌면 자동화 안정성이 떨어질 수 있다.

적합한 범위:

- 초기 read-only Drive 연결
- 파일 선택 기반 업로드
- 운영자가 직접 승인하는 파일 작업

### 2안: Service Account + Shared Drive 방식

회사 Shared Drive에 서비스 계정 권한을 부여하고, SALMAN OS 백엔드가 Drive API를 실행하는 방식이다.

장점:

- 회사 운영 Drive를 안정적으로 자동화하기 좋다.
- 직원 개인 계정 상태에 덜 의존한다.
- 백엔드 중심으로 파일 추가, 폴더 생성, 보관 이동을 일관되게 처리할 수 있다.

단점:

- 서비스 계정 키/권한 관리가 중요하다.
- Shared Drive 권한 설계가 먼저 필요하다.
- 개인 My Drive 전체 접근에는 맞지 않는다.

적합한 범위:

- SALMAN_OS_DRIVE Shared Drive 운영
- 고객사 폴더 자동 생성
- Drive 구조 정기 동기화
- 파일 업로드/보관 이동 자동화

### 3안: Service Account + Domain-wide Delegation

Google Workspace 관리자가 서비스 계정에 도메인 전체 위임을 부여하는 방식이다.

장점:

- 회사 전체 사용자 Drive 접근이나 마이그레이션 자동화가 가능하다.
- 장기적으로 전사 Drive 색인/RAG 준비에 사용할 수 있다.

단점:

- 권한 범위가 크고 보안 리스크가 높다.
- Google Workspace 최고 관리자 승인이 필요하다.
- v1에서 바로 쓰기에는 과하다.

권장:

- v1에서는 사용하지 않는다.
- 꼭 필요할 때 별도 보안 검토 후 진행한다.

## 권장 인증 방향

SALMAN OS v1 Drive 연동은 아래 순서가 안전하다.

```text
1. Shared Drive 생성
2. SALMAN_OS_DRIVE 루트 폴더 확정
3. 서비스 계정 또는 제한된 관리자 계정에 Shared Drive 권한 부여
4. 백엔드에서만 Drive API 호출
5. 먼저 read-only 동기화
6. 이후 파일 추가/폴더 생성/보관 이동 활성화
```

전체 My Drive를 바로 읽는 구조는 v1에서 제외한다.

## Drive API 액션 매핑

### 폴더 목록 읽기

화면 액션:

```text
고객사 상세 > 구글 드라이브 > 폴더 트리 표시
```

백엔드 동작:

- 고객사 `drive_root_folder_id` 확인
- Google Drive API로 하위 폴더 목록 조회
- Supabase 캐시와 비교
- 화면용 트리 구조 반환

Drive API 개념:

- `files.list`
- `q` 검색 조건
- `fields`로 필요한 필드만 요청

### 파일 목록 읽기

화면 액션:

```text
폴더 클릭 > 해당 폴더의 파일 목록 표시
```

백엔드 동작:

- 선택한 `drive_folder_id` 기준으로 파일 조회
- `trashed=false` 조건으로 휴지통 파일 제외
- 파일명, MIME type, 수정일, 웹 링크, 부모 폴더 ID 반환

### 폴더 만들기

화면 액션:

```text
폴더 만들기
```

백엔드 동작:

- SALMAN OS 폴더명 규칙 검증
- 중복 폴더명 확인
- Google Drive API로 folder 생성
- Supabase `drive_folders` 메타데이터 저장
- 운영 로그 기록

Drive API 개념:

- `files.create`
- folder MIME type: `application/vnd.google-apps.folder`
- `parents`에 상위 folder ID 지정

### 파일 추가

화면 액션:

```text
파일 추가
```

백엔드 동작:

- 업로드 대상 고객사와 폴더 검증
- 파일명 규칙 검사
- 소형 파일은 multipart upload 후보
- 대형 파일은 resumable upload 후보
- 업로드 성공 후 Google file ID 저장
- Supabase `drive_files` 메타데이터 저장
- 운영 로그 기록

Drive API 개념:

- `files.create`
- `uploadType=multipart`
- `uploadType=resumable`

### 파일명 변경

화면 액션:

```text
파일명 수정
```

백엔드 동작:

- 파일명 규칙 검증
- Google Drive API로 metadata update
- Supabase 캐시 갱신
- 운영 로그 기록

Drive API 개념:

- `files.update`

### 폴더 이동

화면 액션:

```text
다른 폴더로 이동
```

백엔드 동작:

- 기존 부모 folder ID 확인
- 새 부모 folder ID 확인
- Google Drive API로 parents 변경
- Supabase `folder_path`, `parent_folder_id` 갱신
- 운영 로그 기록

Drive API 개념:

- `files.update`
- `addParents`
- `removeParents`

### 보관 이동

화면 액션:

```text
보관 이동
```

백엔드 동작:

- 고객사별 또는 전역 `99_Archive` folder ID 확인
- 파일을 `99_Archive`로 이동
- Supabase `archived_at`, `archive_reason`, `status=archived` 갱신
- 운영 로그 기록

중요:

- 기본 삭제 버튼은 만들지 않는다.
- 실제 Google Drive 영구 삭제는 v1 범위에서 제외한다.
- 운영 정책은 삭제보다 보관이다.

### 드라이브 동기화

화면 액션:

```text
드라이브 동기화
```

백엔드 동작:

- 고객사 root folder부터 하위 폴더/파일 조회
- Google Drive의 현재 상태와 Supabase 캐시 비교
- 새 파일은 insert
- 수정된 파일은 update
- Drive에서 사라진 파일은 즉시 삭제하지 않고 `missing_in_drive` 상태로 표시
- 동기화 로그 저장

## 백엔드 API 초안

실제 endpoint 이름은 구현 시 조정 가능하다.

```text
GET    /api/clients/:clientId/drive/tree
GET    /api/clients/:clientId/drive/files?folderId=
POST   /api/clients/:clientId/drive/folders
POST   /api/clients/:clientId/drive/files
PATCH  /api/drive/files/:driveFileId/rename
PATCH  /api/drive/files/:driveFileId/move
POST   /api/drive/files/:driveFileId/archive
POST   /api/clients/:clientId/drive/sync
GET    /api/drive/sync-jobs/:jobId
```

프론트는 위 API만 호출한다.

프론트가 직접 Google Drive API를 호출하지 않는다.

## Supabase 메타데이터 초안

SQL이 아니라 설계 초안이다.

### `client_drive_roots`

고객사와 Drive 루트 폴더를 연결한다.

필드 후보:

```text
id
client_id
drive_id
root_folder_id
root_folder_name
root_folder_path
is_shared_drive
sync_enabled
last_synced_at
created_at
updated_at
```

### `drive_folders`

Drive 폴더 메타데이터 캐시다.

필드 후보:

```text
id
client_id
drive_folder_id
parent_drive_folder_id
folder_name
folder_path
folder_code
read_policy
is_archive
sync_status
last_seen_at
created_at
updated_at
```

### `drive_files`

Drive 파일 메타데이터 캐시다.

필드 후보:

```text
id
client_id
drive_file_id
drive_folder_id
file_name
mime_type
file_extension
web_view_link
size_bytes
checksum
owner_email
last_modified_at
last_seen_at
sync_status
status
archived_at
archive_reason
created_at
updated_at
```

### `drive_sync_jobs`

Drive 동기화 실행 기록이다.

필드 후보:

```text
id
client_id
requested_by
status
started_at
finished_at
scanned_folder_count
scanned_file_count
created_count
updated_count
missing_count
error_message
```

### `drive_action_logs`

Drive 파일 작업 감사 로그다.

필드 후보:

```text
id
client_id
drive_file_id
drive_folder_id
action_type
actor_name
before_payload
after_payload
result_status
error_message
created_at
```

## 동기화 상태값

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

## 충돌 처리 기준

### Drive에 있고 Supabase에 없는 파일

처리:

- Supabase에 새 메타데이터 생성
- `sync_status=synced`

### Supabase에 있고 Drive에 없는 파일

처리:

- 즉시 삭제하지 않는다.
- `sync_status=missing_in_drive`
- 운영자가 확인 후 보관/제거 판단

### SALMAN OS에서 이동했는데 Drive 이동 실패

처리:

- Supabase 상태를 완료로 바꾸지 않는다.
- `sync_status=error`
- 오류 메시지 저장
- 재시도 버튼 제공

### Drive에서 사람이 직접 파일명을 바꾼 경우

처리:

- Drive 이름을 우선 표시
- Supabase 캐시 갱신
- 운영 로그에 외부 변경으로 기록

## 권한 정책

v1 현재 로그인은 공통 비밀번호 + 이름 입력이다.

실제 Drive 쓰기 기능을 켜기 전에는 최소한 아래가 필요하다.

- 직원 계정 식별
- 역할 구분: 관리자, 운영자, 읽기 전용
- 파일 추가/보관/폴더 생성 권한 분리
- 모든 Drive 쓰기 작업은 감사 로그 기록

권장 역할:

```text
admin: 폴더 생성, 파일 추가, 이동, 보관, 동기화 가능
operator: 파일 추가, 보관 요청, 동기화 가능
viewer: 읽기만 가능
```

## UI 반영 기준

고객사 상세 화면의 Google Drive 패널은 아래 구조를 기준으로 한다.

```text
구글 드라이브
|-- 상단 액션바
|   |-- 파일 추가
|   |-- 폴더 만들기
|   +-- 드라이브 동기화
|
|-- 왼쪽 폴더 트리
|   |-- 전체 자료
|   |-- 01_Client_Operations
|   |-- 04_SA_Operations
|   |-- 06_Creative_Assets
|   +-- 99_Archive
|
+-- 오른쪽 파일 목록
    |-- 파일명
    |-- 폴더 경로
    |-- 상태
    |-- 원본 열기
    +-- 보관 이동
```

## 구현 순서

### Phase 1. UI 구조 정리

상태:

- 완료

내용:

- 고객사 상세의 자료 패널을 Drive 파일 허브 형태로 변경
- 폴더 트리와 파일 목록 UI 추가
- 파일 추가, 폴더 만들기, 동기화, 보관 이동 액션 위치 확정
- 실제 Drive API 호출은 하지 않음

### Phase 2. Supabase 메타데이터 스키마 초안

다음 작업 후보.

내용:

- `client_drive_roots`
- `drive_folders`
- `drive_files`
- `drive_sync_jobs`
- `drive_action_logs`

주의:

- SQL 실행은 하지 않는다.
- 먼저 초안 문서 또는 SQL draft만 작성한다.

### Phase 3. Backend Drive adapter 설계

내용:

- `DriveRepository` 인터페이스 정의
- `MockDriveRepository` 먼저 구현
- `GoogleDriveRepository`는 credential 없이 계획만 둔다
- React 컴포넌트가 Drive SDK를 직접 import하지 않게 한다

### Phase 4. Read-only Drive sync

내용:

- 고객사 root folder 기준 파일/폴더 읽기
- Supabase 캐시 갱신
- 화면에서 실제 Drive 구조 표시

주의:

- 파일 생성/수정/삭제 없음
- read-only smoke test만 수행

### Phase 5. Write actions

내용:

- 폴더 생성
- 파일 업로드
- 파일명 변경
- 폴더 이동
- 보관 이동

주의:

- 관리자 권한과 감사 로그가 먼저 필요하다.
- 실제 삭제는 제외한다.

### Phase 6. Incremental sync / notification

내용:

- 변경사항 기반 동기화
- 필요 시 Google Drive push notification 검토
- webhook receiver는 HTTPS 백엔드에서만 처리

## 구현 전 결정해야 할 것

1. SALMAN_OS_DRIVE를 Shared Drive로 만들 것인가?
2. 서비스 계정 방식으로 갈 것인가, OAuth 사용자 승인 방식으로 갈 것인가?
3. v1에서 Drive 쓰기 권한을 누구에게 줄 것인가?
4. 파일 삭제를 완전히 막고 보관 이동만 허용할 것인가?
5. 고객사별 root folder ID를 어디에서 최초 등록할 것인가?
6. 파일 업로드 최대 크기와 허용 확장자를 어떻게 제한할 것인가?
7. Drive 동기화는 수동 버튼부터 시작할 것인가, 자동 주기 실행까지 포함할 것인가?

## 공식 문서 참고

- Google Drive API 파일/폴더 개요: https://developers.google.com/drive/api/guides/about-files
- Google Drive API 파일/폴더 검색: https://developers.google.com/drive/api/guides/search-files
- Google Drive API 폴더 생성/파일 이동: https://developers.google.com/workspace/drive/api/guides/folder
- Google Drive API 업로드: https://developers.google.com/drive/api/v3/manage-uploads
- Google Drive API 권한 범위: https://developers.google.com/drive/api/guides/api-specific-auth
- Google Drive API 삭제/휴지통: https://developers.google.com/workspace/drive/api/guides/delete
- Google Drive push notifications: https://developers.google.com/workspace/drive/api/guides/push
- Google Workspace domain-wide delegation: https://support.google.com/a/answer/162106

## 현재 결론

지금 바로 Google Drive API를 붙이면 안 된다.

먼저 아래 순서가 맞다.

```text
1. Drive 연동 설계 확정
2. Supabase Drive metadata schema 초안
3. backend Drive adapter 인터페이스 설계
4. mock backend로 UI 연결
5. read-only Google Drive sync
6. write actions 활성화
```

SALMAN OS는 Google Drive를 대체하지 않는다.

SALMAN OS는 Google Drive 원본 파일을 내부 운영 데이터와 연결해 관리하는 운영센터다.
