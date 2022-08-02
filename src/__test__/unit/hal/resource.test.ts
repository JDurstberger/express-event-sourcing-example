import { Resource } from '../../../shared/hal'

describe('HAL Resource', () => {
  describe('links', () => {
    test('link does not exist by default', () => {
      const resource = Resource.create()

      const uri = resource.getHref('key')

      expect(uri).toBeUndefined()
    })

    test('adds link to resource', () => {
      const linkRel = 'self'
      const expectedUri = 'https://example.com'
      const resource = Resource.create().addLink(linkRel, expectedUri)

      const uri = resource.getHref(linkRel)

      expect(uri).toStrictEqual(expectedUri)
    })

    test('returns new resource when adding link to resource', () => {
      const linkRel = 'self'
      const uri = 'https://example.com'
      const resource = Resource.create()

      const resourceWithLink = resource.addLink(linkRel, uri)

      expect(resourceWithLink).not.toBe(resource)
    })

    test('adds multiple links to resource', () => {
      const linkRel1 = 'rel1'
      const expectedUri1 = 'https://example1.com'
      const linkRel2 = 'rel2'
      const expectedUri2 = 'https://example2.com'
      const resource = Resource.create().addLinks({
        [linkRel1]: expectedUri1,
        [linkRel2]: expectedUri2
      })

      const uri1 = resource.getHref(linkRel1)
      const uri2 = resource.getHref(linkRel2)

      expect(uri1).toStrictEqual(expectedUri1)
      expect(uri2).toStrictEqual(expectedUri2)
    })
  })

  describe('properties', () => {
    test('property does not exist by default', () => {
      const resource = Resource.create()

      const property = resource.getProperty('key')

      expect(property).toBeUndefined()
    })

    test('adds property to resource', () => {
      const key = 'x'
      const expectedProperty = 'a'
      const resource = Resource.create().addProperty(key, expectedProperty)

      const property = resource.getProperty(key)

      expect(property).toStrictEqual(expectedProperty)
    })

    test('adds multiple properties to resource', () => {
      const key1 = 'k1'
      const key2 = 'k2'
      const value1 = 'abc'
      const value2 = 123
      const resource = Resource.create().addProperties({
        [key1]: value1,
        [key2]: value2
      })

      expect(resource.getProperty(key1)).toStrictEqual(value1)
      expect(resource.getProperty(key2)).toStrictEqual(value2)
    })
  })

  describe('embedded resources', () => {
    test('embedded resource does not exist by default', () => {
      const resource = Resource.create()

      const embeddedResource = resource.getResource('key')

      expect(embeddedResource).toBeUndefined()
    })

    test('adds embedded resource to resource', () => {
      const key = 'key'
      const expectedEmbeddedResource = Resource.create()
      const resource = Resource.create().addResource(
        key,
        expectedEmbeddedResource
      )

      const embeddedResource = resource.getResource('key')

      expect(embeddedResource).toStrictEqual(expectedEmbeddedResource)
    })

    test('adds embedded resources to resource', () => {
      const key = 'key'
      const expectedEmbeddedResources = [Resource.create(), Resource.create()]
      const resource = Resource.create().addResource(
        key,
        expectedEmbeddedResources
      )

      const embeddedResource = resource.getResource('key')

      expect(embeddedResource).toStrictEqual(expectedEmbeddedResources)
    })

    test('returns resource from index', () => {
      const key = 'key'
      const resource1 = Resource.create().addProperty('id', 1)
      const resource2 = Resource.create().addProperty('id', 2)
      const resource = Resource.create().addResource(key, [
        resource1,
        resource2
      ])

      const embeddedResource = resource.getResourceAt('key', 0)

      expect(embeddedResource).toStrictEqual(resource1)
    })

    test('returns undefined when trying to access array resource not available', () => {
      const key = 'key'
      const resource = Resource.create().addResource(key, [])

      const embeddedResource = resource.getResourceAt('key', 0)

      expect(embeddedResource).toBeUndefined()
    })

    test('returns resource when trying to access non-array resource from index 0', () => {
      const key = 'key'
      const expectedEmbeddedResource = Resource.create()
      const resource = Resource.create().addResource(
        key,
        expectedEmbeddedResource
      )

      const embeddedResource = resource.getResourceAt('key', 0)

      expect(embeddedResource).toStrictEqual(expectedEmbeddedResource)
    })

    test('returns undefined when trying to access non-array resource from index >0', () => {
      const key = 'key'
      const resource = Resource.create().addResource(key, Resource.create())

      const embeddedResource = resource.getResourceAt('key', 1)

      expect(embeddedResource).toBeUndefined()
    })
  })

  describe('to JSON', () => {
    test('creates empty resource', () => {
      const resource = Resource.create()

      const json = resource.toJson()

      expect(json).toStrictEqual({})
    })

    test('creates JSON with _link', () => {
      const linkRel = 'self'
      const uri = 'https://example.com'
      const resource = Resource.create().addLink(linkRel, uri)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _links: {
          self: { href: uri }
        }
      })
    })

    test('creates JSON with property', () => {
      const propertyKey = 'key'
      const propertyValue = 'value'
      const resource = Resource.create().addProperty(propertyKey, propertyValue)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        [propertyKey]: propertyValue
      })
    })

    test('creates JSON with embedded resource', () => {
      const embeddedResourceKey = 'key'
      const embeddedResource = Resource.create()
      const resource = Resource.create().addResource(
        embeddedResourceKey,
        embeddedResource
      )

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _embedded: {
          [embeddedResourceKey]: {}
        }
      })
    })

    test('creates JSON with embedded resource array', () => {
      const embeddedResourceKey = 'key'
      const embeddedResources = [Resource.create(), Resource.create()]
      const resource = Resource.create().addResource(
        embeddedResourceKey,
        embeddedResources
      )

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _embedded: {
          [embeddedResourceKey]: [{}, {}]
        }
      })
    })
  })

  describe('from JSON', () => {
    test('creates empty resource from JSON', () => {
      const originalHalJson = {}

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })

    test('creates resource with link from JSON', () => {
      const originalHalJson = {
        _links: { self: { href: 'https://example.com' } }
      }

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })

    test('creates resource with property from JSON', () => {
      const originalHalJson = {
        prop: 'value'
      }

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })

    test('creates resource with embedded resource from JSON', () => {
      const originalHalJson = {
        _embedded: {
          something: {
            prop: 123
          }
        }
      }

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })
  })
})
