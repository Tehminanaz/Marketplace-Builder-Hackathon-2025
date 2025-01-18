import { createClient } from '@sanity/client'
import axios from 'axios'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2021-08-31'
})
async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop()
    })
    console.log(`Image uploaded successfully: ${asset._id}`)
    return asset._id
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error)
    return null
  }
}
async function importData() {
  try {
    console.log('Fetching products from API...')
    const response = await axios.get('https://hackathon-apis.vercel.app/api/products')
    const products = response.data
    console.log(`Fetched ${products.length} products`)
    for (const product of products) {
      console.log(`Processing product: ${product.title}`)
      let imageRef = null
      if (product.image) {
        imageRef = await uploadImageToSanity(product.image)
      }
      const sanityProduct = {
        _id: `product-${counter}`, // Prefix the ID to ensure validity
                _type: 'product',
                name: product.name,
                slug: {
                    _type: 'slug',
                    current: (0, slugify_1.default)(product.name || 'default-product', {
                        lower: true, // Ensure the slug is lowercase
                        strict: true, // Remove special characters
                    }),
                },
                price: product.price,
                category: {
                    _type: 'reference',
                    _ref: catRef ? catRef : undefined
                },
                tags: product.tags ? product.tags : [],
                quantity: 50,
                image: imageRef ? {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageRef, // Set the correct asset reference ID
                    },
                } : undefined,
                description: product.description ? product.description : "A timeless design, with premium materials features as one of our most popular and iconic pieces. The dandy chair is perfect for any stylish living space with beech legs and lambskin leather upholstery.",
                features: product.features ? product.features : [
                    "Premium material",
                    "Handmade upholstery",
                    "Quality timeless classic",
                ],
                dimensions: product.dimensions ? product.dimensions : {
                    _type: 'dimensions', // Custom object type for dimensions
                    height: "110cm",
                    width: "75cm",
                    depth: "50cm",
                }
            };
            counter++;
         // Log the product before attempting to upload it to Sanity
         console.log('Uploading product:', sanityProduct);
         // Import data into Sanity
         await sanityClient_js_1.client.createOrReplace(sanityProduct);
         console.log(`✅ Imported product: ${sanityProduct.name}`);
     }
     console.log('✅ Data import completed!');
 }
 catch (error) {
     console.error('❌ Error importing data:', error);
 }
}
importData()