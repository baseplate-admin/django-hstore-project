# HStore vs JSONB

| Feature | HStore | JSONB |
|---------|--------|-------|
| Requires PostgreSQL extension | Yes | No |
| Flat key-value support | Yes | Yes |
| Nested structure support | No | Yes |
| Non-string values | No | Yes |
| Simple admin UI | Yes (with this widget) | No |
| Easy validation | Yes | No |
| Advanced JSON queries | No | Yes |
| Containment queries | No | Yes |
| Storage footprint | Smaller | Larger |
| Metadata fields | Good | Good |
| Structured documents | No | Yes |

## When to Use HStore

- Simple key-value metadata (tags, properties, attributes)
- Need a user-friendly admin interface
- Want smaller storage footprint
- All values are strings

## When to Use JSONB

- Nested data structures
- Mixed value types (numbers, booleans, arrays)
- Complex queries with containment operators
- Document-like data storage
