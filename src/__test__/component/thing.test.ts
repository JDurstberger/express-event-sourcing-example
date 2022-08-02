import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { Resource } from '../../shared/hal'
import { extraMatchers } from '../test-support/extra-matchers'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomUUID } from 'crypto'
import { randomCreateThingBody, randomName } from '../test-support/data'
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

describe('Thing', () => {
  test('creates thing', async () => {
    const app = supertest(system.app)
    const name = randomName()
    const postBody = randomCreateThingBody({ name })
    const request = app.post('/things').send(postBody)

    const response = await request

    const resource = Resource.fromJson(response.body)
    const id = resource.getProperty('id')
    expect(response.statusCode).toBe(201)
    expect(id).toBeUuid()
    expect(resource).toContainHref('self', `${request.url}/${id}`)
    expect(resource.getProperty('name')).toEqual(name)
  })

  test('does not create thing when properties are missing', async () => {
    const app = supertest(system.app)
    const request = app.post('/things').send({})

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
      .send(randomCreateThingBody())
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

  test('creates creation event for thing', async () => {
    const app = supertest(system.app)
    await app.post('/things').send(randomCreateThingBody())

    const response = await app.get('/events')

    const eventsResource = Resource.fromJson(response.body)
    const eventResource = eventsResource.getResourceAt('events', 0)!
    const eventId = eventResource.getProperty('id')
    expect(response.statusCode).toBe(200)
    expect(eventsResource.getResource('events')).toHaveLength(1)
    expect(eventId).toBeUuid()
    expect(eventResource.getProperty('occurredAt')).toBeIso8601()
    expect(eventResource.getProperty('observedAt')).toBeIso8601()
    expect(eventResource).toContainProperty('type', 'thing-created')
    expect(eventResource).toContainHrefMatching(
      'self',
      new RegExp(`/events/${eventId}$`)
    )
    expect(eventResource).toContainHrefMatching(
      'thing',
      new RegExp(`/things/.*$`)
    )
  })
})
