import {Database} from "../shared/database";
import {Event } from './event'
import {Moment} from "moment";

const allEventsStatement = "SELECT * FROM events"

export const allEvents = async (database: Database): Promise<Event[]> => {
  const result = await database.pool.query(allEventsStatement)
  return result.rows
}

const createEventStatement = "INSERT INTO events(id, observed_at, occurred_at, type, payload, stream_id, stream_type) VALUES($1, $2, $3, $4, $5, $6, $7)"

export type AddEvent = {
  id: string,
  observedAt: Moment,
  occurredAt: Moment,
  type: string,
  payload: object,
  streamId: string,
  streamType: string
}

export const addEvent = async (database: Database, event: AddEvent) => {
  const values = [
    event.id,
    event.observedAt.toISOString(),
    event.occurredAt.toISOString(),
    event.type,
    event.payload,
    event.streamId,
    event.streamType
  ]
  await database.pool.query(createEventStatement, values)
}
