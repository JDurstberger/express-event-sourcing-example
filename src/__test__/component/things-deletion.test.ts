import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { Resource } from '../../shared/hal'
import { extraMatchers } from '../test-support/extra-matchers'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomUUID } from 'crypto'
import { randomCreateThingBody } from '../test-support/data'
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

describe('Thing Deletion', () => {
  test('can not delete non-existent thing', async () => {
    const app = supertest(system.app)

    const response = await app.del(`/things/${randomUUID()}`)

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(404)
    expect(resource).toContainProperty('error', 'resource not found')
  })

  test('deleting thing creates event', async () => {
    const app = supertest(system.app)
    const creationResponse = await app
      .post('/things')
      .send(randomCreateThingBody())
    const createdThing = Resource.fromJson(creationResponse.body)
    await app.del(`/things/${createdThing.getProperty('id')}`)

    const response = await app.get('/events')

    expect(response.statusCode).toBe(200)
    const eventsResource = Resource.fromJson(response.body)
    const eventResource = eventsResource.getResourceAt('events', 1)!
    expect(response.statusCode).toBe(200)
    expect(eventResource).toContainLinkRels(['self'])
    expect(eventsResource.getResource('events')).toHaveLength(2)
    expect(eventResource.getProperty('occurredAt')).toBeIso8601()
    expect(eventResource.getProperty('observedAt')).toBeIso8601()
    expect(eventResource.getProperty('streamId')).toBe(
      createdThing.getProperty('id')
    )
    expect(eventResource.getProperty('type')).toStrictEqual('thing-deleted')
  })

  test('deleting thing makes thing unavailable', async () => {
    const app = supertest(system.app)
    const creationResponse = await app
      .post('/things')
      .send(randomCreateThingBody())
    const createdThing = Resource.fromJson(creationResponse.body)
    await app.del(`/things/${createdThing.getProperty('id')}`)

    const response = await app.get(`/things/${createdThing.getProperty('id')}`)

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(404)
    expect(resource).toContainProperty('error', 'resource not found')
  })
})
