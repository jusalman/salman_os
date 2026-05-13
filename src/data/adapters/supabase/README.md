# Supabase Adapter Foundation

This folder contains the minimal Supabase browser client foundation for SALMAN OS.

TASK-31 adds the official browser client package and a read-only draft adapter for the `clients` table. The active app still defaults to mock data.

Future adapters should implement these repository interfaces:

- `ClientListRepository`
- `ClientDetailRepository`
- `SmartOperationViewsRepository`

Current policy:

- `VITE_DATA_SOURCE=mock` uses the mock repositories.
- `VITE_DATA_SOURCE=supabase` uses not implemented placeholder repositories that reject with a clear error.
- Missing or invalid `VITE_DATA_SOURCE` values fall back to `mock`.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are the only frontend Supabase env values.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the Vite frontend.

v1 must keep Google Drive as source file links and Supabase as operational data only.
