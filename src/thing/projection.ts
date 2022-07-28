import { Database } from '../shared/database'
import { allEventsForStream } from '../events/queries'
import { Event } from '../events/event'
import { Thing } from './thing'
import {
  UpsertProjection,
  upsertProjection,
} from '../shared/projections/queries'
import moment from 'moment'

export const project = async (database: Database, id: string) => {
  const events = await allEventsForStream(database, id)

  const thing = events.reduce(reduceThingEvent, {}) as Thing
  const now = moment().utc()
  const projection: UpsertProjection = {
    id: thing.id,
    createdAt: now,
    updatedAt: now,
    type: 'thing',
    schemaVersion: 1,
    payload: thing,
  }

  await upsertProjection(database, projection)
}

const reduceThingEvent = (acc: object, event: Event) => {
  switch (event.type) {
    case 'thing-created':
      return applyCreationEvent(acc, event)
    default:
      return acc
  }
}

const applyCreationEvent = (acc: object, event: Event) => ({
  ...acc,
  id: event.streamId,
  name: event.payload.name,
})
