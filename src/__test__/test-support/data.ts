import faker from 'faker'

export const randomName = () => faker.name.findName()

export const randomCreateThingBody = ({ name }: { name?: string } = {}) => ({
  name: name ?? randomName()
})
