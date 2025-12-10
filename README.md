# NestJS Metadata Demo

This is a demo project showcasing how to implement a lightweight metadata extension
that allows **storing** and **filtering** metadata in a **key-value format** using NestJS and PostgreSQL
inspired by Stripe's metadata approach.


## Why this project?

This allows user-defined and custom metadata fields to be added to existing entities, which enables users to
store additional information without modifying the database schema. This is particularly useful when you want your users
to be able to integrate with external systems that require some kind of data mapping.

- how to implement a **`metadata` field** (key-value store) with TypeORM and Postgres (`jsonb`).
- how an **HTTP query model** similar to Stripe's can look like, e.g. `?metadata[customerId]=cust_42`.
- how to build **secure queries** that still filter dynamically on `metadata` without allowing SQL injection.
- how to create a **GIN index** on the `metadata` field for efficient querying.
- how to implement **DTOs and validation** for input data and query strings.

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

# Key steps

* Add a JSONB column (e.g. metadata) to the target table (invoices).
* Create a GIN index for search performance:
```
CREATE INDEX idx_invoices_metadata
  ON invoices
  USING GIN (metadata jsonb_path_ops);
```
* Implement DTOs and services in the app to read/write metadata (see src/invoices/dto/* and src/invoices/invoices.service.ts).
* Use decorator (`IsMetadata()`) for metadata validation (see src/shared/decorators/is-metadata.decorator.ts).