import { Request } from 'express'
import { toPairs } from 'ramda'

export enum Route {
  Discovery,
  Events,
  Thing,
  Things
}

export const routeToExpressRoute = (route: Route) => {
  switch (route) {
    case Route.Discovery:
      return '/'
    case Route.Events:
      return '/events'
    case Route.Things:
      return '/things'
    case Route.Thing:
      return '/things/:thingId'
  }
}

const routeToTemplate = (route: Route) => {
  switch (route) {
    case Route.Discovery:
      return '/'
    case Route.Events:
      return '/events'
    case Route.Things:
      return '/things'
    case Route.Thing:
      return '/things/{thingId}'
  }
}

export type Context = Record<string, number | string | boolean>

const parseTemplate = (template: string, context: Context) =>
  toPairs(context).reduce(
    (template, [k, v]) => template.replace(`{${k}}`, `${v}`),
    template
  )

const buildUrlBase = (request: Request) =>
  request.protocol + '://' + request.headers['host']

export const templateFor = (request: Request, route: Route) =>
  buildUrlBase(request) + routeToTemplate(route)

export const linkFor = (request: Request, route: Route, context?: Context) =>
  buildUrlBase(request) + parseTemplate(routeToTemplate(route), context ?? {})
