import { AddEvent } from '../events'
import { randomUUID } from 'crypto'
import moment from 'moment'

export type ThingCreatedPayload = {
  name: string
}

export const createThingCreatedEvent = (): AddEvent<ThingCreatedPayload> => {
  const eventId = randomUUID()
  const thingId = randomUUID()
  const now = moment.utc()
  return {
    id: eventId,
    observedAt: now,
    occurredAt: now,
    payload: {
      name: 'Frederick' //TODO replace with posted name
    },
    type: 'thing-created',
    streamType: 'thing',
    streamId: thingId
  }
}
