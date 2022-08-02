import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { loadConfiguration } from '../test-support/configuration'
import { Resource } from '../../shared/hal'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomEvent } from '../test-support/data'
import { addEvent } from '../../events'
import { randomUUID } from 'crypto'

expect.extend(halMatchers)

const configuration = loadConfiguration()

let system: System

beforeEach(async () => {
  await clearDatabase(configuration.database)
  system = await createSystem(configuration)
})

afterEach(async () => {
  await system?.shutdown()
})

describe('Events', () => {
  test('returns empty response by default', async () => {
    const app = supertest(system.app)

    const request = app.get('/events')
    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.status).toStrictEqual(200)
    expect(resource).toContainHref('self', request.url)
    expect(resource.getResource('events')).toStrictEqual([])
  })

  test('returns event when event available', async () => {
    const app = supertest(system.app)
    const eventId = randomUUID()
    const event = randomEvent({ id: eventId })
    await addEvent(system.database, event)

    const request = app.get('/events')
    const response = await request

    const resource = Resource.fromJson(response.body)
    const eventResource = resource.getResourceAt('events', 0)
    expect(response.status).toStrictEqual(200)
    expect(resource.getResource('events')).toHaveLength(1)
    expect(eventResource).toContainProperty('id', eventId)
  })

  test('non-existent event returns not found', async () => {
    const app = supertest(system.app)

    const request = app.get(`/events/${randomUUID()}`)
    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.status).toStrictEqual(404)
    expect(resource).toContainProperty('error', 'resource not found')
  })

  test('event is accessibly by id', async () => {
    const app = supertest(system.app)
    const eventId = randomUUID()
    const event = randomEvent({ id: eventId })
    await addEvent(system.database, event)

    const request = app.get(`/events/${eventId}`)
    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.status).toStrictEqual(200)
    expect(resource).toContainProperty('id', eventId)
  })
})
