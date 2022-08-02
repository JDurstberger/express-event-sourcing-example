import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { loadConfiguration } from '../test-support/configuration'
import { Resource } from '../../shared/hal'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'

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
  test('return empty response by default', async () => {
    const app = supertest(system.app)
    const request = app.get('/events')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.status).toStrictEqual(200)
    expect(resource).toContainHref('self', request.url)
    expect(resource.getResource('events')).toStrictEqual([])
  })
})
