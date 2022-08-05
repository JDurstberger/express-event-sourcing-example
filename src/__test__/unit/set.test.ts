import { areSetsEqual } from '../../shared/set'

describe('set', () => {
  it.each([
    [[], [], 'equal', true],
    [[1], [1], 'equal', true],
    [['1'], ['1'], 'equal', true],
    [[1], [], 'not equal', false],
    [[], [1], 'not equal', false],
    [['1'], [1], 'not equal', false],
    [[[1]], [[1]], 'not equal', false]
  ])(
    '%s and %s are %s',
    (
      s1: Array<unknown>,
      s2: Array<unknown>,
      _: string,
      expectedEquality: boolean
    ) => {
      const set1 = new Set(s1)
      const set2 = new Set(s2)

      const equality = areSetsEqual(set1, set2)

      expect(equality).toStrictEqual(expectedEquality)
    }
  )
})
