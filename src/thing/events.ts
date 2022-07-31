import { AddEvent } from '../events'
import { randomUUID } from 'crypto'
import moment from 'moment'

export type ThingCreatedPayload = {
  name: string
}

export type CreateThingData = {
  name: string
}

export const createThingCreatedEvent = (
  data: CreateThingData
): AddEvent<ThingCreatedPayload> => {
  const eventId = randomUUID()
  const thingId = randomUUID()
  const now = moment.utc()
  return {
    id: eventId,
    observedAt: now,
    occurredAt: now,
    payload: {
      name: data.name
    },
    type: 'thing-created',
    streamType: 'thing',
    streamId: thingId
  }
}
