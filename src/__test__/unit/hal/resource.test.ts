import {Resource} from '../../../shared/hal'

describe("HAL Resource", () => {
  describe("links", () => {
    it("link does not exist by default", () => {
      const resource = Resource.create()

      const uri = resource.getHref('key')

      expect(uri).toBeUndefined()
    })

    it("adds link to resource", () => {
      const linkRel = 'self'
      const expectedUri = "https://example.com"
      const resource = Resource.create()
        .addLink(linkRel, expectedUri)

      const uri = resource.getHref(linkRel)

      expect(uri).toStrictEqual(expectedUri)
    })

    it("returns new resource when adding link to resource", () => {
      const linkRel = 'self'
      const uri = "https://example.com"
      const resource = Resource.create()

      const resourceWithLink = resource.addLink(linkRel, uri)


      expect(resourceWithLink).not.toBe(resource)
    })

    it("adds multiple links to resource", () => {
      const linkRel1 = 'rel1'
      const expectedUri1 = "https://example1.com"
      const linkRel2 = 'rel2'
      const expectedUri2 = "https://example2.com"
      const resource = Resource.create()
        .addLinks({
          [linkRel1]: expectedUri1,
          [linkRel2]: expectedUri2
        })

      const uri1 = resource.getHref(linkRel1)
      const uri2 = resource.getHref(linkRel2)

      expect(uri1).toStrictEqual(expectedUri1)
      expect(uri2).toStrictEqual(expectedUri2)
    })
  })

  describe("properties", () => {
    it("property does not exist by default", () => {
      const resource = Resource.create()

      const property = resource.getProperty('key')

      expect(property).toBeUndefined()
    })

    it("adds property to resource", () => {
      const key = 'x'
      const expectedProperty = "a"
      const resource = Resource.create()
        .addProperty(key, expectedProperty)

      const property = resource.getProperty(key)

      expect(property).toStrictEqual(expectedProperty)
    })
  })

  describe("embedded resources", () => {
    it("embedded resource does not exist by default", () => {
      const resource = Resource.create()

      const embeddedResource = resource.getResource('key')

      expect(embeddedResource).toBeUndefined()
    })

    it("adds embedded resource to resource", () => {
      const key = 'key'
      const expectedEmbeddedResource = Resource.create()
      const resource = Resource.create()
        .addResource(key, expectedEmbeddedResource)

      const embeddedResource = resource.getResource('key')

      expect(embeddedResource).toStrictEqual(expectedEmbeddedResource)
    })

    it("adds embedded resources to resource", () => {
      const key = 'key'
      const expectedEmbeddedResources = [
        Resource.create(),
        Resource.create(),
        ]
      const resource = Resource.create()
        .addResource(key, expectedEmbeddedResources)

      const embeddedResource = resource.getResource('key')

      expect(embeddedResource).toStrictEqual(expectedEmbeddedResources)
    })
  })

  describe("to JSON", () => {
    it("creates empty resource", () => {
      const resource = Resource.create()

      const json = resource.toJson()

      expect(json).toStrictEqual({})
    })

    it("creates JSON with _link", () => {
      const linkRel = 'self'
      const uri = "https://example.com"
      const resource = Resource.create()
        .addLink(linkRel, uri)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _links: {
          self: {href: uri}
        }
      })
    })

    it("creates JSON with property", () => {
      const propertyKey = 'key'
      const propertyValue = "value"
      const resource = Resource.create()
        .addProperty(propertyKey, propertyValue)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        [propertyKey]: propertyValue
      })
    })

    it("creates JSON with embedded resource", () => {
      const embeddedResourceKey = 'key'
      const embeddedResource = Resource.create()
      const resource = Resource.create()
        .addResource(embeddedResourceKey, embeddedResource)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _embedded: {
          [embeddedResourceKey]: {}
        }
      })
    })

    it("creates JSON with embedded resource array", () => {
      const embeddedResourceKey = 'key'
      const embeddedResources = [Resource.create(), Resource.create()]
      const resource = Resource.create()
        .addResource(embeddedResourceKey, embeddedResources)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _embedded: {
          [embeddedResourceKey]: [{}, {}]
        }
      })
    })
  })

  describe("from JSON", () => {
    it("creates empty resource from JSON", () => {
      const originalHalJson = {}

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })

    it("creates resource with link from JSON", () => {
      const originalHalJson = {
        _links: {self: {href: "https://example.com"}}
      }

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })

    it("creates resource with property from JSON", () => {
      const originalHalJson = {
        prop: "value"
      }

      const resource = Resource.fromJson(originalHalJson)
      const newHalJson = resource.toJson()

      expect(newHalJson).toStrictEqual(originalHalJson)
    })

    it("creates resource with embedded resource from JSON", () => {
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
