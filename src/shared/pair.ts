export type Pair<T1, T2> = [T1, T2]

export const createPair = <T1, T2>(v1: T1, v2: T2): Pair<T1, T2> => [v1, v2]
