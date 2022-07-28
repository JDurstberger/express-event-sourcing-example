import { Database } from '../shared/database'
import { Thing } from './thing'
import { thingByIdStatement } from './sql'

const dbThingToThing = (thing: any): Thing => {
  return {
    id: thing.id,
    name: thing.payload.name
  }
}

export const findThingById = async (
  database: Database,
  id: string
): Promise<Thing | null> => {
  const result = await database.query(thingByIdStatement, [id])
  const dbThing = result.rows[0]
  return dbThing ? dbThingToThing(dbThing) : null
}

export const getThingById = async (
  database: Database,
  id: string
): Promise<Thing> => {
  const thing = await findThingById(database, id)
  if (thing === null) throw Error(`Unable to get thing with id ${id}`)

  return thing
}
