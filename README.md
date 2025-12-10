# NestJS Metadata Demo

This is a demo project showcasing how to implement a lightweight metadata extension
that allows **storing** and **filtering** metadata in a **key-value format** using NestJS and PostgreSQL
inspired by [Stripe's metadata](https://docs.stripe.com/metadata) approach.


## Why this project?

This allows user-defined and custom metadata fields to be added to existing entities, which enables users to
store additional information without modifying the database schema. This is particularly useful when you want your users
to be able to integrate with external systems that require some kind of data mapping.

- how to implement a **`metadata` field** (key-value store) with TypeORM and Postgres (`jsonb`).
- how an **HTTP query model** similar to Stripe's can look like, e.g. `?metadata[customerId]=cust_42`.
- how to build **secure queries** that still filter dynamically on `metadata` without allowing SQL injection.
- how to create a **GIN index** on the `metadata` field for efficient querying.
- how to implement **DTOs and validation** for input data and query strings.
- how to allow safe updates and key removals (using an empty string) of metadata entries.

## Used technologies

* NestJS
* PostgreSQL
* TypeORM
* Swagger (@nestjs/swagger)
  
## Advantages

* No extra tables required — metadata kept inline on the entity (invoices).
* Independent key updates — different systems can update their own namespaced keys without conflicts.
* Multiple values per entity supported.
* Indexable and searchable via PostgreSQL JSONB GIN indexes — fast queries.
* Easy to add to existing schemas and integrations.

## Key steps

### Add a JSONB column (e.g. metadata)

```typescript
@Column('jsonb', { default: {} })
metadata: Record<string, string>;
```

### Create a GIN index for search performance

Create an GIN index for your table and metadata columns in a migration file (preferred) or
run it directly in your database:

```postgresql
CREATE INDEX idx_invoices_metadata
  ON invoices
  USING GIN (metadata jsonb_path_ops);
```

You may want to add a hint to TypeORM to avoid it trying to remove the index:

```typescript
@Entity('invoices')
@Index('idx_invoices_metadata', { synchronize: false })
export class Invoice {
  // ...
}
```

### Implement DTOs and services for create operations

```typescript
export class CreateInvoiceDto {
  // ...
  @IsOptional()
  @IsMetadata()
  metadata?: Record<string, string>;
}
```

This uses the custom `IsMetadata` decorator for validation. It ensures that metadata is an object with
string keys (alphanumeric and underscores only) and string values (max length 255 characters).
See [src/shared/decorators/is-metadata.decorator.ts](src/shared/decorators/is-metadata.decorator.ts).

### Implement filtering by metadata in queries

This allows filtering by metadata keys and values using query parameters like
`?metadata[key]=value`. We need to ensure that NestJS (and the underlying Express library) parses the query parameters
correctly into an object. Add the following configuration in `main.ts`:

```typescript
app.set('query parser', 'extended');
```

> [!IMPORTANT]
> This is an important step, as the default query parser does not support nested objects.

Validate query parameters using a DTO:

```typescript
class FindInvoicesQueryDto {
  @IsOptional()
  @IsMetadata()
  metadata?: Record<string, string>;
}
```

Use query parameters with TypeORM's QueryBuilder to build secure queries:

```typescript
 async findAll(query: FindInvoicesQueryDto) {
    const queryBuilder = this.invoiceRepository.createQueryBuilder('i');

    if (query.metadata) {
      let index = 0;
      for (const [key, value] of Object.entries(query.metadata)) {
        queryBuilder.andWhere(`i.metadata ->> :key${index} = :value${index}`, {
          [`key${index}`]: key,
          [`value${index}`]: value,
        });
        index++;
      }
    }

    return queryBuilder.getMany();
  }
```

### Implement updates and removals of metadata entries
To update metadata entries, merge the existing metadata with the new entries.

Add a DTO for updates:

```typescript
@IsOptional()
@IsMetadata()
metadata?: Record<string, string>;
```

In the service, merge the existing metadata with the new entries:

```typescript
const metadata = { ...(invoice.metadata ?? {}) };

if (data.metadata) {
  for (const [key, value] of Object.entries(data.metadata)) {
    if (value === '') {
      // if key is provided, but has an empty value, remove it from metadata
      delete metadata[key];
    } else {
      metadata[key] = value;
    }
  }
}

return this.invoiceRepository.save({
  ...invoice,
  ...data,
  metadata: metadata,
});
```

### Add Swagger documentation

Add appropriate Swagger decorators to your DTOs to document the metadata field. Use `type: 'object'` with
`additionalProperties: { type: 'string' }` to indicate that the metadata is a key-value object with string values.

Check [src/invoices/dto/create-invoice.dto.ts](src/invoices/dto/create-invoice.dto.ts) or
[src/invoices/dto/find-invoices-query.dto.ts](src/invoices/dto/find-invoices-query.dto.ts)
for an example implementation.


## Links

* Stripe Metadata Guide: https://docs.stripe.com/metadata
* Stripe API Reference (metadata): https://stripe.com/docs/api/metadata