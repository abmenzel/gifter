import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import Product from '../interfaces/IProduct'
import Filter from '../interfaces/IFilter'
import shuffle from '../utils/shuffle'

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		const file = path.resolve('./public', 'data/test.json')
		const json = JSON.parse(fs.readFileSync(file).toString())
	
		res.status(200).json(json)
	} catch (error: any) {
		res.status(500).json({ error: error.message })
	}
}
