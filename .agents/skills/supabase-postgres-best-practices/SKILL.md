# Supabase Postgres Best Practices

## Indexing
- Create indexes on foreign keys and frequently queried columns
- Use partial indexes for filtered queries
- Consider composite indexes for multi-column queries

## Performance
- Use `EXPLAIN ANALYZE` to identify slow queries
- Implement connection pooling for production
- Regular VACUUM and ANALYZE maintenance

## Security
- Enable Row Level Security (RLS) on all tables
- Use prepared statements to prevent SQL injection
- Implement least-privilege database roles
