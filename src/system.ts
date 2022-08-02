import express, { Express } from 'express'
import { Configuration } from './configuration'

import { createDiscoveryRoutes } from './discovery'
import { Database } from './shared/database'
import { createThingRoutes } from './things'
import { createEventsRoutes } from './events'
import bodyParser from 'body-parser'

export type System = {
  app: Express
  database: Database
  shutdown: () => Promise<void>
}

export const createSystem = async (
  configuration: Configuration
): Promise<System> => {
  const app = express()

  app.use(bodyParser.json())

  const database = await Database.create(configuration.database)

  createDiscoveryRoutes(app)
  createThingRoutes(app, { database })
  createEventsRoutes(app, { database })

  return {
    app,
    database,
    shutdown: async () => await database.end()
  }
}
