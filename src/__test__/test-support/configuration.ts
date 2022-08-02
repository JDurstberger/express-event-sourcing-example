import { loadConfiguration as loadProdConfiguration } from '../../configuration'

export const loadConfiguration = () =>
  loadProdConfiguration({ path: '.env-test' })
