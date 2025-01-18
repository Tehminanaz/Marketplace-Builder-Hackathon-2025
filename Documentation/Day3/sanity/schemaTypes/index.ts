import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType],
}
