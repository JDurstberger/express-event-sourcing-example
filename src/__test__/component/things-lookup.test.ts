import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { Resource } from '../../shared/hal'
import { extraMatchers } from '../test-support/extra-matchers'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomUUID } from 'crypto'
import { randomThingBody } from '../test-support/data'
import { loadConfiguration } from '../test-support/configuration'

expect.extend(halMatchers)
expect.extend(extraMatchers)

const configuration = loadConfiguration()
let system: System

beforeEach(async () => {
  await clearDatabase(configuration.database)
  system = await createSystem(configuration)
})

afterEach(async () => {
  await system?.shutdown()
})

describe('Thing Lookup', () => {
  test('non existent thing returns not found', async () => {
    const app = supertest(system.app)
    const request = app.get(`/things/${randomUUID()}`)

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(404)
    expect(resource).toContainProperty('error', 'resource not found')
  })

  test('thing is accessible via id', async () => {
    const app = supertest(system.app)
    const creationResponse = await app
      .post('/things')
      .send(randomThingBody())
    const createdResource = Resource.fromJson(creationResponse.body)
    const path = new URL(createdResource.getHref('self')!).pathname
    const request = app.get(path)

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource.getProperty('id')).toStrictEqual(
      createdResource.getProperty('id')
    )
  })
})
