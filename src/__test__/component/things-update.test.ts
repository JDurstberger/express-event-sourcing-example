import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { Resource } from '../../shared/hal'
import { extraMatchers } from '../test-support/extra-matchers'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomUUID } from 'crypto'
import { randomThingBody} from '../test-support/data'
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

describe('Thing Update', () => {
  test('can not update non-existent thing', async () => {
    const app = supertest(system.app)

    const response = await app.put(`/things/${randomUUID()}`)

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(404)
    expect(resource).toContainProperty('error', 'resource not found')
  })

  test('updating thing creates event', async () => {
    const app = supertest(system.app)
    const creationResponse = await app
      .post('/things')
      .send(randomThingBody())
    const createdThing = Resource.fromJson(creationResponse.body)
    const thingId = createdThing.getProperty('id');
    await app
      .put(`/things/${thingId}`)
      .send(randomThingBody())

    const response = await app.get('/events')

    expect(response.statusCode).toBe(200)
    const eventsResource = Resource.fromJson(response.body)
    expect(eventsResource.getResource('events')).toHaveLength(2)
    const eventCreateResource = eventsResource.getResourceAt('events', 0)!
    expect(eventCreateResource.getProperty('type')).toStrictEqual('thing-created')
    expect(eventCreateResource).toContainLinkRels(['self', 'thing'])
    expect(eventCreateResource.getProperty('occurredAt')).toBeIso8601()
    expect(eventCreateResource.getProperty('observedAt')).toBeIso8601()
    expect(eventCreateResource.getProperty('streamId')).toBe(thingId)
    const eventUpdateResource = eventsResource.getResourceAt('events', 1)!
    expect(eventUpdateResource.getProperty('type')).toStrictEqual('thing-updated')
    expect(eventUpdateResource).toContainLinkRels(['self', 'thing'])
    expect(eventUpdateResource.getProperty('occurredAt')).toBeIso8601()
    expect(eventUpdateResource.getProperty('observedAt')).toBeIso8601()
    expect(eventUpdateResource.getProperty('streamId')).toBe(thingId)
  })

  test('does not update thing when properties are missing', async () => {
    const app = supertest(system.app)
    const creationResponse = await app
      .post('/things')
      .send(randomThingBody())
    const createdThing = Resource.fromJson(creationResponse.body)
    const request = app.put(`/things/${createdThing.getProperty('id')}`).send({})

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(422)
    expect(resource).toContainHrefMatching('self', /\/things$/)
    expect(resource.getProperty('errorDetails')).toStrictEqual([
      {
        context: { key: 'name', label: 'name' },
        message: '"name" is required',
        path: ['name'],
        type: 'any.required'
      }
    ])
  })
})
