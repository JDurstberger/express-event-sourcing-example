import CustomMatcher = jest.CustomMatcher;
import CustomMatcherResult = jest.CustomMatcherResult;

const toContainHref: CustomMatcher = (received, key: string, url: string): CustomMatcherResult => {
  const pass = received._links[key].href === url
  if (pass) {
    return {
      message: () => `hal resource contained href`,
      pass: true
    }
  } else {
    return {
      message: () => `${JSON.stringify(received._links)} did not contain ${key} with value ${url}`,
      pass: false
    }
  }
}

export const halMatchers = {
  toContainHref
}

interface HalMatchers<R = unknown> {
  toContainHref(key: string, url: string): R;
}

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace jest {
    interface Expect extends HalMatchers {
    }

    interface Matchers<R> extends HalMatchers<R> {
    }

    interface InverseAsymmetricMatchers extends HalMatchers {
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
