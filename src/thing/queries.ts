import { Database } from '../shared/database'
import { Thing } from './thing'

const thingByIdStatement = 'SELECT * FROM projections where id = $1'

const dbThingToThing = (thing: any): Thing => {
  return {
    id: thing.id,
    name: thing.payload.name,
  }
}

export const getThingById = async (
  database: Database,
  id: string,
): Promise<Thing | null> => {
  const result = await database.query(thingByIdStatement, [id])
  const dbThing = result.rows[0]
  return dbThing ? dbThingToThing(dbThing) : null
}
