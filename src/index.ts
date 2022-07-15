import {app} from './app'
import {loadConfig} from "./configuration";

const configuration = loadConfig()

const port = configuration.service.port
app.listen(
  port,
  () => console.log(`App started on port ${port}`)
)
