import { Database } from '../database'
import { Moment } from 'moment'
import { upsertProjectionStatement } from './sql'

export type UpsertProjection = {
  id: string
  createdAt: Moment
  updatedAt: Moment
  type: string
  schemaVersion: number
  payload: object
}

export const upsertProjection = async (
  database: Database,
  projection: UpsertProjection
) => {
  const values = [
    projection.id,
    projection.createdAt.toISOString(),
    projection.updatedAt.toISOString(),
    projection.type,
    projection.schemaVersion,
    projection.payload
  ]
  await database.query(upsertProjectionStatement, values)
}
