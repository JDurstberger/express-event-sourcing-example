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
