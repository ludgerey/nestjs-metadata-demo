# Additional steps

## Creating a GIN Index

```sql
CREATE INDEX idx_invoices_metadata
    ON invoices
    USING GIN (metadata jsonb_path_ops);
```