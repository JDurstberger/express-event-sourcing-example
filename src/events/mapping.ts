import { Request } from 'express'
import { Event } from './event'
import { Resource } from '../shared/hal'
import { linkFor, Route } from '../links'

const attachThingCreatedEventCharacteristics = (
  request: Request,
  resource: Resource,
  event: Event
) =>
  resource.addLink(
    'thing',
    linkFor(request, Route.Thing, { thingId: event.streamId })
  )

const attachThingUpdatedEventCharacteristics = (
  request: Request,
  resource: Resource,
  event: Event
) =>
  resource.addLink(
    'thing',
    linkFor(request, Route.Thing, { thingId: event.streamId })
  )

const createBaseResource = (request: Request, event: Event) =>
  Resource.create()
    .addLinks({
      self: linkFor(request, Route.Event, { eventId: event.id })
    })
    .addProperties({
      id: event.id,
      streamId: event.streamId,
      type: event.type,
      occurredAt: event.occurredAt,
      observedAt: event.observedAt
    })

export const eventToResource = (request: Request, event: Event) => {
  const resource = createBaseResource(request, event)
  switch (event.type) {
    case 'thing-created':
      return attachThingCreatedEventCharacteristics(request, resource, event)
    case 'thing-updated':
      return attachThingUpdatedEventCharacteristics(request, resource, event)
    default:
      return resource
  }
}
