# TASK-46 Client Seed SQL

## Purpose

Review-only manual seed SQL for one safe test client so SALMAN OS ClientList can display a real Supabase row.

- Do not run automatically.
- User review first.
- User executes manually in Supabase SQL Editor if approved.

## Required `clients` columns

- `name`
- `status`
- `service_type`
- `owner_name`

## Included optional ClientList fields

- `drive_root_url`
- `memo`

## Minimal manual seed SQL

```sql
insert into public.clients (
  name,
  status,
  service_type,
  owner_name,
  drive_root_url,
  memo
) values (
  '테스트 고객사',
  'active',
  'sa',
  '테스트 담당자',
  'https://drive.google.com/drive/folders/test-client-root',
  'SALMAN OS ClientList 확인용 테스트 데이터'
);
```

## Notes

- No related rows are required for the first ClientList display check.
- With only this row, summary-derived values should remain safely empty: task count `0`, upcoming event count `0`, Biz Money warning `false`, latest log `null`, Looker/Sheet link flags `false`.
- `drive_root_url` is included so `hasDriveFolder` can resolve as present from the base client row alone.
