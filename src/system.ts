import express, { Express } from 'express'
import { Configuration } from './configuration'

import { createDiscoveryRoutes } from './discovery'
import { Database } from './shared/database'
import { createThingRoutes } from './thing'
import { createEventsRoutes } from './events'

export type System = {
  app: Express
  shutdown: () => Promise<void>
}

export const createSystem = async (
  configuration: Configuration
): Promise<System> => {
  const app = express()

  const database = await Database.create(configuration.database)

  createDiscoveryRoutes(app)
  createThingRoutes(app, { database })
  createEventsRoutes(app, { database })

  return {
    app,
    shutdown: async () => await database.end()
  }
}
