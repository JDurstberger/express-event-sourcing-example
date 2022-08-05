import fs from 'fs'

export const upsertProjectionStatement = fs.readFileSync(
  './src/shared/projections/sql/upsertProjection.sql',
  'utf8'
)

export const deleteProjectionStatement = fs.readFileSync(
  './src/shared/projections/sql/deleteProjection.sql',
  'utf8'
)
