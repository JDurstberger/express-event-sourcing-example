import { halMatchers } from '../test-support/hal-matchers'
import { createApp } from '../../app'
import { loadConfiguration } from '../../configuration'
import { Resource } from '../../shared/hal'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'

expect.extend(halMatchers)

const configuration = loadConfiguration()

beforeEach(async () => {
  await clearDatabase(configuration.database)
})

describe('Events', () => {
  it('return empty response by default', async () => {
    const { app } = await createApp(configuration)
    const system = supertest(app)
    const request = system.get('/events')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.status).toStrictEqual(200)
    expect(resource).toContainHref('self', request.url)
    expect(resource.getResource('events')).toStrictEqual([])
  })
})
