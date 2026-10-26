# Data ownership
No launcher DB or shared app DB. Health keeps Neon plus its Dexie offline store; Journal keeps its own Neon and private R2. Proposed naming does not justify renaming existing resources. Use committed Drizzle migrations, not db:push, for Health. Never apply a rewritten migration baseline over an existing database. Verify migration ledger and schema on a restored copy first.
