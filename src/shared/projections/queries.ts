import { Database } from '../database'
import { Moment } from 'moment'
import { deleteProjectionStatement, upsertProjectionStatement } from './sql'

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

export const deleteProjection = async (database: Database, id: string) => {
  await database.query(deleteProjectionStatement, [id])
}
