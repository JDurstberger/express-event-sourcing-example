import { DatabaseConfiguration } from '../../configuration'
import { Database } from '../../shared/database'

const clearDatabaseStatement = 'TRUNCATE events, projections CASCADE;'

export const clearDatabase = async (configuration: DatabaseConfiguration) => {
  const database = await Database.create(configuration)
  await database.query(clearDatabaseStatement)
  await database.end()
}
