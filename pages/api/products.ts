import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import Product from '../../interfaces/IProduct'
import Filter from '../../interfaces/IFilter'

const shuffle = (arr: any[]) => {
	let currentIndex = arr.length,
		randomIndex
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--
		;[arr[currentIndex], arr[randomIndex]] = [
			arr[randomIndex],
			arr[currentIndex],
		]
	}
	return arr
}

const selectProducts = (
	arr: Map<string, Product>,
	filter: Filter
): Product[] => {
	const randomHandles: string[] = shuffle(Array.from(arr.keys()))
	const selected: Product[] = randomHandles
		.filter((handle) => {
			const product = arr.get(handle) as Product
			const withinPriceRange =
				product.price >= filter.price_min &&
				product.price <= filter.price_max
			const withinCategories =
				filter.categories.length === 0 ||
				filter.categories.includes(product.categories[0])
			return withinPriceRange && withinCategories
		})
		.slice(0, filter.limit)
		.map((handle) => arr.get(handle) as Product)
	return selected
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		const filter: Filter = {
			limit: req.query.limit ? parseInt(req.query.limit as string) : 4,
			categories: req.query.categories
				? (req.query.categories as string).split(',')
				: [],
			price_min: req.query.price_min
				? parseInt(req.query.price_min as string)
				: 0,
			price_max: req.query.price_max
				? parseInt(req.query.price_max as string)
				: 1_000_000,
		}

		const file = path.resolve('./public', 'data/products.json')
		const product_json = JSON.parse(fs.readFileSync(file).toString())
		const products: Map<string, Product> = new Map(
			Object.entries(product_json)
		)

		const selectedProducts = selectProducts(products, filter)

		res.status(200).json(selectedProducts)
	} catch (error: any) {
		res.status(500).json({ error: error.message })
	}
}
