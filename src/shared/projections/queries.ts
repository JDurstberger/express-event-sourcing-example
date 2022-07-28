import { Database } from '../database'
import * as fs from 'fs'
import { Moment } from 'moment'

export type UpsertProjection = {
  id: string
  createdAt: Moment
  updatedAt: Moment
  type: string
  schemaVersion: number
  payload: object
}

const upsertProjectionStatement = fs.readFileSync(
  './src/shared/projections/upsertProjection.sql',
  'utf8',
)

export const upsertProjection = async (
  database: Database,
  projection: UpsertProjection,
) => {
  const values = [
    projection.id,
    projection.createdAt.toISOString(),
    projection.updatedAt.toISOString(),
    projection.type,
    projection.schemaVersion,
    projection.payload,
  ]
  await database.query(upsertProjectionStatement, values)
}
