import { DatabaseConfiguration } from '../../configuration'
import { migrate } from 'postgres-migrations'
import { Pool } from 'pg'
import pg from 'pg'

export type Database = {
  pool: Pool
}

const runMigrations = async (config: DatabaseConfiguration) => {
  const dbConfig = {
    database: config.name,
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    ensureDatabaseExists: true,
    defaultDatabase: 'postgres',
  }

  await migrate(dbConfig, './src/shared/database/migrations')
}

export const createDatabase = async (
  config: DatabaseConfiguration,
): Promise<Database> => {
  await runMigrations(config)
  return {
    pool: new pg.Pool({
      user: config.user,
      host: config.host,
      database: config.name,
      password: config.password,
      port: config.port,
    }),
  }
}
