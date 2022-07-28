INSERT INTO projections
(id,
 created_at,
 updated_at,
 type,
 schema_version,
 payload)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (id) DO UPDATE SET updated_at     = $3,
                               type           = $4,
                               schema_version = $5,
                               payload        = $6;
