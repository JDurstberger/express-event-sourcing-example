CREATE TABLE projections
(
    id             UUID        NOT NULL
        CONSTRAINT projections_pkey PRIMARY KEY,
    created_at     TIMESTAMPTZ NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL,
    type           VARCHAR,
    schema_version INTEGER DEFAULT 1,
    payload        JSONB       NOT NULL
);
