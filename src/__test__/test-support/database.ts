import { DatabaseConfiguration } from '../../configuration'
import { createDatabase } from '../../shared/database'

const clearDatabaseStatement = 'TRUNCATE events CASCADE;'

export const clearDatabase = async (configuration: DatabaseConfiguration) => {
  const database = await createDatabase(configuration)
  await database.pool.query(clearDatabaseStatement)
  await database.pool.end()
}
