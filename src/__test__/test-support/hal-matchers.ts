import CustomMatcher = jest.CustomMatcher
import CustomMatcherResult = jest.CustomMatcherResult
import { Resource } from '../../shared/hal'
import { Property } from '../../shared/hal/resource'
import { keys } from 'ramda'
import { areSetsEqual } from '../../shared/set'

const toContainHref: CustomMatcher = (
  received: Resource,
  rel: string,
  url: string
): CustomMatcherResult => {
  const pass = received.getHref(rel) === url
  if (pass) {
    return {
      message: () => `hal resource contained href`,
      pass: true
    }
  } else {
    return {
      message: () =>
        `Resource ${JSON.stringify(
          received.toJson()
        )} did not contain ${rel} with value ${url}`,
      pass: false
    }
  }
}

const toContainLinkRels: CustomMatcher = (
  received: Resource,
  rels: Array<string>
): CustomMatcherResult => {
  const expectedLinkRelations = new Set(rels)
  const linkRelations = new Set(keys(received.links))
  const pass = areSetsEqual(expectedLinkRelations, linkRelations)
  if (pass) {
    return {
      message: () => `hal resource contained rels`,
      pass: true
    }
  } else {
    return {
      message: () =>
        `Resource link relations ${JSON.stringify(
          linkRelations
        )} of ${JSON.stringify(
          received.toJson()
        )} did not match ${JSON.stringify(rels)}`,
      pass: false
    }
  }
}

const toContainHrefMatching: CustomMatcher = (
  received: Resource,
  rel: string,
  regex: RegExp
): CustomMatcherResult => {
  const href = received.getHref(rel)
  const pass = href !== undefined ? regex.test(href) : false
  if (pass) {
    return {
      message: () => `hal resource contained href`,
      pass: true
    }
  } else {
    return {
      message: () =>
        `Resource ${JSON.stringify(
          received.toJson()
        )} did not contain ${rel} matching ${regex}`,
      pass: false
    }
  }
}

const toContainProperty: CustomMatcher = (
  received: Resource,
  key: string,
  value: Property
): CustomMatcherResult => {
  const pass = received.getProperty(key) === value
  if (pass) {
    return {
      message: () => `hal resource contained property`,
      pass: true
    }
  } else {
    return {
      message: () =>
        `Resource did not contain property ${key} with value ${value}`,
      pass: false
    }
  }
}

export const halMatchers = {
  toContainHref,
  toContainProperty,
  toContainHrefMatching,
  toContainLinkRels
}

interface HalMatchers<R = unknown> {
  toContainHref(rel: string, url: string): R

  toContainHrefMatching(rel: string, regex: RegExp): R

  toContainLinkRels(rels: Array<string>): R

  toContainProperty(key: string, value: Property): R
}

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace jest {
    interface Expect extends HalMatchers {}

    interface Matchers<R> extends HalMatchers<R> {}

    interface InverseAsymmetricMatchers extends HalMatchers {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
