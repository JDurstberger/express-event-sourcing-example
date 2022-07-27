import express from 'express'
import { Configuration } from './configuration'

import { createDiscoveryResource } from './discovery'
import { createDatabase } from './shared/database'
import { createThingResource } from './thing'
import { createEventsResource } from './events'

export const createApp = async (configuration: Configuration) => {
  const app = express()

  const database = await createDatabase(configuration.database)

  createDiscoveryResource(app)
  createThingResource(app, { database })
  createEventsResource(app, { database })

  return {
    app,
    shutDown: async () => await database.pool.end(),
  }
}
