import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { Route, routeToExpressRoute, templateFor } from '../links'

export const createDiscoveryRoutes = (app: Express) => {
  app
    .route(routeToExpressRoute(Route.Discovery))
    .get((request: Request, response: Response) => {
      const resource = Resource.create()
        .addLink('self', templateFor(request, Route.Discovery))
        .addLink('events', templateFor(request, Route.Events))
        .addLink('things', templateFor(request, Route.Things))
        .addLink('thing', templateFor(request, Route.Thing))
        .toJson()
      return response.json(resource)
    })
}
