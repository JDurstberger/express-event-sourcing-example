import { Database } from '../shared/database'
import { Event } from './event'
import moment, { Moment } from 'moment'
import {
  allEventsForStreamStatement,
  allEventsStatement,
  insertEventStatement
} from './sql'

export type AddEvent<T> = {
  id: string
  observedAt: Moment
  occurredAt: Moment
  type: string
  streamId: string
  streamType: string
  payload: T
}

const dbEventToEvent = (event: any): Event => ({
  id: event.id,
  observedAt: moment(event.observed_at).utc(),
  occurredAt: moment(event.occurred_at).utc(),
  type: event.type,
  streamId: event.stream_id,
  streamType: event.stream_type,
  payload: event.payload
})

export const allEvents = async (database: Database): Promise<Event[]> => {
  const result = await database.query(allEventsStatement)
  return result.rows.map(dbEventToEvent)
}

export const allEventsForStream = async (
  database: Database,
  streamId: string
): Promise<Event[]> => {
  const result = await database.query(allEventsForStreamStatement, [streamId])
  return result.rows.map(dbEventToEvent)
}

export const addEvent = async <T>(database: Database, event: AddEvent<T>) => {
  const values = [
    event.id,
    event.observedAt.toISOString(),
    event.occurredAt.toISOString(),
    event.type,
    event.payload,
    event.streamId,
    event.streamType
  ]
  await database.query(insertEventStatement, values)
}
