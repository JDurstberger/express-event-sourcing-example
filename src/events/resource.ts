import {Express, Request, Response} from "express";
import {Resource} from '../shared/hal'
import {Database} from "../shared/database";
import {allEvents} from './queries'
import {Event} from './event'

const buildSelf = ({protocol, headers, url}: Request) =>
  `${protocol}://${headers['host']}${url}`

const eventToResource = (event: Event) =>
  Resource.create()
    .addProperty('id', event.id)

export const createEventsResource = (app: Express, dependencies: { database: Database }) => {
  const {database} = dependencies

  app.route('/events')
    .get(
      async (request: Request, response: Response) => {
        const events = await allEvents(database)
        const eventResources = events.map(eventToResource)

        const resource = Resource.create()
          .addLink('self', buildSelf(request))
          .addResource('events', eventResources)
          .toJson()
        return response.json(resource)
      }
    )
}
