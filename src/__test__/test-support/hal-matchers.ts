import CustomMatcher = jest.CustomMatcher
import CustomMatcherResult = jest.CustomMatcherResult
import { Resource } from '../../shared/hal'

const toContainHref: CustomMatcher = (
  received: Resource,
  rel: string,
  url: string,
): CustomMatcherResult => {
  const pass = received.getHref(rel) === url
  if (pass) {
    return {
      message: () => `hal resource contained href`,
      pass: true,
    }
  } else {
    return {
      message: () => `Resource did not contain ${rel} with value ${url}`,
      pass: false,
    }
  }
}

export const halMatchers = {
  toContainHref,
}

interface HalMatchers<R = unknown> {
  toContainHref(rel: string, url: string): R
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