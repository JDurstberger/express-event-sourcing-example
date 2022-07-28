import { Database } from '../shared/database'
import { Event } from './event'
import moment, { Moment } from 'moment'

export type AddEvent<T> = {
  id: string
  observedAt: Moment
  occurredAt: Moment
  type: string
  streamId: string
  streamType: string
  payload: T
}

const allEventsStatement = 'SELECT * FROM events'

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

const allEventsForStreamStatement = 'SELECT * FROM events WHERE stream_id = $1'

export const allEventsForStream = async (
  database: Database,
  streamId: string
): Promise<Event[]> => {
  const result = await database.query(allEventsForStreamStatement, [streamId])
  return result.rows.map(dbEventToEvent)
}

const createEventStatement =
  'INSERT INTO events(id, observed_at, occurred_at, type, payload, stream_id, stream_type) VALUES($1, $2, $3, $4, $5, $6, $7)'

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
  await database.query(createEventStatement, values)
}
