import {isEmpty, mapObjIndexed, toPairs} from "ramda";

export type Link = {
  readonly href: string
}
export type Links = Record<string, Link>

//TODO: get rid of undefined
export type Property = boolean | string | number | object | [] | undefined
export type Properties = Record<string, Property>

export type EmbeddedResource = Resource | Resource[]
export type Resources = Record<string, EmbeddedResource>

export class Resource {
  readonly links: Links
  readonly properties: Properties
  readonly resources: Resources

  static create() {
    return new Resource({}, {}, {})
  }

  constructor(
    links: Links,
    resources: Resources,
    properties: Properties,
  ) {
    this.links = links
    this.resources = resources
    this.properties = properties
  }


  addLink(rel: string, uri: string): Resource {
    return new Resource(
      {
        ...this.links,
        [rel]: {href: uri}
      },
      this.resources,
      this.properties,
    )
  }

  addLinks(rawLinks: Record<string, string>) {
    return toPairs(rawLinks).reduce(
      (resource: Resource, [rel, uri]) =>
        resource.addLink(rel, uri),
      this)
  }

  getHref(rel: string): string | undefined {
    return this.links[rel]?.href
  }

  getProperty(key: string): Property | undefined {
    return this.properties[key]
  }

  addProperty(key: string, value: Property) {
    return new Resource(
      this.links,
      this.resources,
      {
        ...this.properties,
        [key]: value
      },
    )
  }

  getResource(key: string): EmbeddedResource | undefined {
    return this.resources[key]
  }

  addResource(key: string, embeddedResource: EmbeddedResource) {
    return new Resource(
      this.links,
      {
        ...this.resources,
        [key]: embeddedResource
      },
      this.properties
    )
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  toJson(): object {
    const json: Record<string, any> = {
      ...this.properties
    }
    if (!isEmpty(this.links))
      json["_links"] = this.links

    if (!isEmpty(this.resources))
      json["_embedded"] = mapObjIndexed(
        resource => Array.isArray(resource)
          ? resource.map(r => r.toJson())
          : resource.toJson(),
        this.resources)

    return json
  }

  /* eslint-enable  @typescript-eslint/no-explicit-any */

  static fromJson({_links, _embedded, ...properties}: JsonResource): Resource {
    return new Resource(
      _links ?? {},
      mapObjIndexed(
        resource => Array.isArray(resource)
          ? resource.map(r => Resource.fromJson(r))
          : Resource.fromJson(resource),
        _embedded ?? {}),
      properties)
  }
}

type EmbeddedJsonResources = JsonResource | JsonResource[]
type JsonResource = {
  _links?: Record<string, Link>,
  _embedded?: Record<string, EmbeddedJsonResources>
  [k: string]: Property
}




