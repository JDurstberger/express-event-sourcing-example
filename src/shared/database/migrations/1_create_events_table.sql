CREATE TABLE events
(
    id              UUID                    NOT NULL
        CONSTRAINT events_pkey PRIMARY KEY,
    sequence_number SERIAL,
    observed_at     TIMESTAMP DEFAULT now() NOT NULL,
    occurred_at     TIMESTAMP DEFAULT now() NOT NULL,
    type            VARCHAR                 NOT NULL,
    payload         JSONB                   NOT NULL,
    stream_id       UUID                    NOT NULL,
    stream_type     VARCHAR                 NOT NULL
);
