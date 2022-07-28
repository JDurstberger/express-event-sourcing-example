import { createSystem } from './system'
import { loadConfiguration } from './configuration'

const configuration = loadConfiguration()

const port = configuration.service.port
const { app, shutdown } = await createSystem(configuration)

const server = app.listen(port, () =>
  console.log(`App started on port ${port}`)
)

process.on('SIGTERM', () => {
  server.close(async () => {
    console.log('HTTP server closed')
    await shutdown()
  })
})
