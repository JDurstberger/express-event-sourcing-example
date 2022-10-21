import { addEvent } from '../events'
import { project } from './projection'
import { Database } from '../shared/database'
import {
  createThingCreatedEvent,
  CreateThingData,
  createThingUpdatedEvent,
  UpdateThingData,
  createThingDeletedEvent,
} from './events'
import { Thing } from './thing'
import { getThingById } from './queries'

export const createThing = async (
  dependencies: {
    database: Database
  },
  data: CreateThingData
): Promise<Thing> => {
  const { database } = dependencies
  const event = createThingCreatedEvent(data)

  return await database.withTransaction(async (database) => {
    await addEvent(database, event)
    await project(database, event.streamId)
    return getThingById(database, event.streamId)
  })
}

export const updateThing = async (
  dependencies: {
    database: Database
  },
  thingId: string,
  data: UpdateThingData
): Promise<Thing> => {
  const { database } = dependencies
  const event = createThingUpdatedEvent(thingId, data)

  return await database.withTransaction(async (database) => {
    await addEvent(database, event)
    await project(database, event.streamId)
    return getThingById(database, event.streamId)
  })
}

export const deleteThing = async (
  dependencies: {
    database: Database
  },
  thing: Thing
): Promise<void> => {
  const { database } = dependencies
  const event = createThingDeletedEvent({ id: thing.id })

  return await database.withTransaction(async (database) => {
    await addEvent(database, event)
    await project(database, event.streamId)
  })
}
