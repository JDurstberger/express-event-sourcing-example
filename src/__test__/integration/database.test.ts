import { clearDatabase } from '../test-support/database'
import { Database } from '../../shared/database'
import { addEvent } from '../../events'
import { allEvents } from '../../events/queries'
import { loadConfiguration } from '../test-support/configuration'
import { randomEvent } from '../test-support/data'

const configuration = loadConfiguration()
let database: Database

beforeEach(async () => {
  await clearDatabase(configuration.database)
  database = await Database.create(configuration.database)
})

afterEach(async () => {
  await database.end()
})

describe('Database', () => {
  test('adds event', async () => {
    const expectedEvent = randomEvent()

    await addEvent(database, expectedEvent)

    const events = await allEvents(database)
    expect(events).toHaveLength(1)
    const event = events[0]
    expect(event.id).toStrictEqual(expectedEvent.id)
    expect(event.observedAt.toISOString()).toStrictEqual(
      expectedEvent.observedAt.toISOString()
    )
    expect(event.occurredAt.toISOString()).toStrictEqual(
      expectedEvent.occurredAt.toISOString()
    )
    expect(event.payload).toStrictEqual(expectedEvent.payload)
    expect(event.type).toStrictEqual(expectedEvent.type)
    expect(event.streamType).toStrictEqual(expectedEvent.streamType)
    expect(event.streamId).toStrictEqual(expectedEvent.streamId)
  })

  describe('transaction', () => {
    test('adds two events in transaction', async () => {
      const event1 = randomEvent()
      const event2 = randomEvent()

      await database.withTransaction(async (database) => {
        await addEvent(database, event1)
        return addEvent(database, event2)
      })

      const events = await allEvents(database)
      expect(events).toHaveLength(2)
    })

    test('adds no events when exception occurs in transaction', async () => {
      const event = randomEvent()
      try {
        await database.withTransaction(async (database) => {
          await addEvent(database, event)
          throw Error('Something went wrong')
        })
      } catch (e) {
        //ignore
      }

      const events = await allEvents(database)
      expect(events).toHaveLength(0)
    })

    test('rethrows when exception occurs in transaction', async () => {
      let exception
      try {
        await database.withTransaction(async () => {
          throw Error('Something went wrong')
        })
      } catch (e) {
        exception = e
      }

      expect(exception).not.toBeUndefined()
    })
  })
})
