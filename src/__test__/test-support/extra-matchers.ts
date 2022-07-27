import CustomMatcher = jest.CustomMatcher
import CustomMatcherResult = jest.CustomMatcherResult

const uuidRegex =
  '^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$'

const toBeUuid: CustomMatcher = (received): CustomMatcherResult => {
  const pass = new RegExp(uuidRegex).test(received)

  if (pass)
    return {
      message: () => `Matched as uuid`,
      pass: true,
    }

  return {
    message: () => `${received} is not a uuid`,
    pass: false,
  }
}

export const extraMatchers = {
  toBeUuid,
}

interface ExtraMatchers<R = unknown> {
  toBeUuid(): R
}

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace jest {
    interface Expect extends ExtraMatchers {}

    interface Matchers<R> extends ExtraMatchers<R> {}

    interface InverseAsymmetricMatchers extends ExtraMatchers {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
