import { AddEvent } from '../events'
import { randomUUID } from 'crypto'
import moment from 'moment'

export type ThingCreatedPayload = {
  name: string
}

export type ThingUpdatedPayload = {
  name: string
}

export type CreateThingData = {
  name: string
}

export type UpdateThingData = {
  id: string,
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

export const createThingUpdatedEvent = (
  thingId: string,
  data: UpdateThingData
): AddEvent<ThingUpdatedPayload> => {
  const eventId = randomUUID()
  const now = moment.utc()
  return {
    id: eventId,
    observedAt: now,
    occurredAt: now,
    payload: {
      name: data.name
    },
    type: 'thing-updated',
    streamType: 'thing',
    streamId: thingId
  }
}

export type ThingDeletedPayload = Record<string, never>

export type DeleteThingData = {
  id: string
}

export const createThingDeletedEvent = (
  data: DeleteThingData
): AddEvent<ThingDeletedPayload> => {
  const eventId = randomUUID()
  const now = moment.utc()
  return {
    id: eventId,
    observedAt: now,
    occurredAt: now,
    payload: {},
    type: 'thing-deleted',
    streamType: 'thing',
    streamId: data.id
  }
}
