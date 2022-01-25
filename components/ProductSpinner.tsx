import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import Product from '../interfaces/IProduct'
import Button from './Button'
import ProductCard from './ProductCard'

const ProductSpinner = (props: any) => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState({})
	const [range, setRange] = useState([0, 100])

	const findProducts = async () => {
		setLoading(true)
		const response = await fetch('/api/products')
		const products = await response.json()
		setProducts(products)
	}
	useEffect(() => {
		findProducts()
	}, [])

	useEffect(() => {
		setLoading(false)
	}, [products])

	return (
		<div>
			<div>

			</div>
			<div className={`flex flex-col h-full justify-between ${props.className}`}>
				<div className='grid grid-cols-2'>
					{products.map((product) => (
							<ProductCard key={product.handle} product={product} />
					))}
				</div>
				<div className="p-8">
					<Button className="mx-auto" onClick={() => findProducts()} label="Nah, prøv igen" />
				</div>
			</div>
		</div>
	)
}

export default ProductSpinner
