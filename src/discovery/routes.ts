import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { Route, routeToExpressRoute, templateFor } from '../links'

export const createDiscoveryRoutes = (app: Express) => {
  app
    .route(routeToExpressRoute(Route.Discovery))
    .get((request: Request, response: Response) => {
      const resource = Resource.create()
        .addLinks({
          self: templateFor(request, Route.Discovery),
          event: templateFor(request, Route.Event),
          events: templateFor(request, Route.Events),
          things: templateFor(request, Route.Things),
          thing: templateFor(request, Route.Thing)
        })
        .toJson()
      return response.json(resource)
    })
}
