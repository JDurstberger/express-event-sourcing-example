import { addEvent } from '../events'
import { project } from './projection'
import { Database } from '../shared/database'
import { createThingCreatedEvent } from './events'
import { Thing } from './thing'
import { getThingById } from './queries'

export const createThing = async (dependencies: {
  database: Database
}): Promise<Thing> => {
  const { database } = dependencies
  const event = createThingCreatedEvent()

  return await database.withTransaction(async (database) => {
    await addEvent(database, event)
    await project(database, event.streamId)
    return getThingById(database, event.streamId)
  })
}
