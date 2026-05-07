# Supabase Adapter Placeholder

This folder is reserved for the future Supabase read adapters for SALMAN OS.

TASK-15 intentionally does not implement a Supabase client, does not install `@supabase/supabase-js`, and does not connect to any external API.

Future adapters should implement these repository interfaces:

- `ClientListRepository`
- `ClientDetailRepository`
- `SmartOperationViewsRepository`

Current policy:

- `VITE_DATA_SOURCE=mock` uses the mock repositories.
- `VITE_DATA_SOURCE=supabase` uses not implemented placeholder repositories that reject with a clear error.
- Missing or invalid `VITE_DATA_SOURCE` values fall back to `mock`.

v1 must keep Google Drive as source file links and Supabase as operational data only.
