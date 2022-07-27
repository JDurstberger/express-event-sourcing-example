import {createApp} from './app'
import {loadConfiguration} from "./configuration";

const configuration = loadConfiguration()

const port = configuration.service.port
const {app, shutDown} = await createApp(configuration)

const server = app.listen(
  port,
  () => console.log(`App started on port ${port}`)
)

process.on('SIGTERM', () => {
  server.close(async () => {
    console.log('HTTP server closed')
    await shutDown()
  })
})
