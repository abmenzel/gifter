import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import Product from '../../interfaces/IProduct'

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		const file = path.resolve('./public', 'data/products.json')
		const product_json = JSON.parse(fs.readFileSync(file).toString())
		const products: Map<string, Product> = new Map(
			Object.entries(product_json)
		)
		const selectProducts = (
			arr: Map<string, Product>,
			size: number
		): Product[] => {
			const keys: string[] = Array.from(arr.keys())
			const selected: Product[] = Array.apply(null, Array(size)).map(
				() => {
					const index: number = Math.floor(
						Math.random() * keys.length
					)
					const handle: string = keys[index]
					return arr.get(handle) as Product
				}
			)
			return selected
		}

		const selectedProducts = selectProducts(products, 4)

		res.status(200).json(selectedProducts)
	} catch (error: any) {
		res.status(500).json({ error: error.message })
	}
}
