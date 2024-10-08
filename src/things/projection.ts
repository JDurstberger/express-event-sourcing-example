import { Database } from '../shared/database'
import { allEventsForStream } from '../events/queries'
import { Event } from '../events'
import { Thing } from './thing'
import {
  deleteProjection,
  UpsertProjection,
  upsertProjection
} from '../shared/projections/queries'
import moment from 'moment'

export const project = async (database: Database, id: string) => {
  const events = await allEventsForStream(database, id)

  const thing = events.reduce(reduceThingEvent, {} as Thing)

  if (thing.hardDeleted)
    return deleteThing(database, thing)
  else
    return upsertThing(database, thing)
}

const reduceThingEvent = (acc: Thing, event: Event) => {
  switch (event.type) {
    case 'thing-created':
      return applyCreationEvent(acc, event)
    case 'thing-deleted':
      return applyDeletionEvent(acc)
    default:
      return acc
  }
}

const applyCreationEvent = (_: Thing, event: Event): Thing => ({
  id: event.streamId,
  name: event.payload.name,
  hardDeleted: false
})

const applyDeletionEvent = (acc: Thing): Thing => ({
  ...acc,
  hardDeleted: true
})

const upsertThing = async (database: Database, thing: Thing) => {
  const now = moment().utc()
  const projection: UpsertProjection = {
    id: thing.id,
    createdAt: now,
    updatedAt: now,
    type: 'thing',
    schemaVersion: 1,
    payload: thing
  }

  await upsertProjection(database, projection)
}

const deleteThing = async (database: Database, thing: Thing) => {
  await deleteProjection(database, thing.id)
}
