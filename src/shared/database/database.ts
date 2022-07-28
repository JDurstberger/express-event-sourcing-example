import { DatabaseConfiguration } from '../../configuration'
import { migrate } from 'postgres-migrations'
import pg, {
  Pool,
  PoolClient,
  QueryConfig,
  QueryResult,
  QueryResultRow
} from 'pg'

const runMigrations = async (config: DatabaseConfiguration) => {
  const dbConfig = {
    database: config.name,
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    ensureDatabaseExists: true,
    defaultDatabase: 'postgres'
  }

  await migrate(dbConfig, './src/shared/database/migrations')
}

export class Database {
  private readonly client?: PoolClient
  private readonly configuration: DatabaseConfiguration
  private readonly pool: Pool

  private constructor(
    configuration: DatabaseConfiguration,
    pool?: Pool,
    client?: PoolClient
  ) {
    this.configuration = configuration
    this.pool =
      pool ??
      new pg.Pool({
        user: configuration.user,
        host: configuration.host,
        database: configuration.name,
        password: configuration.password,
        port: configuration.port
      })
    this.client = client
  }

  static create = async (config: DatabaseConfiguration): Promise<Database> => {
    await runMigrations(config)
    return new Database(config)
  }

  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I
  ): Promise<QueryResult<R>> {
    if (this.client) return this.client.query(queryTextOrConfig, values)

    return this.pool.query(queryTextOrConfig, values)
  }

  async withTransaction(
    fn: (database: Database) => Promise<any>
  ): Promise<any> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const databaseWithClient = new Database(
        this.configuration,
        this.pool,
        client
      )
      await fn(databaseWithClient)
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }

  end(): Promise<void> {
    return this.pool.end()
  }
}
