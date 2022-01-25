import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import IFilter from '../interfaces/IFilter'
import Product from '../interfaces/IProduct'
import { serialize } from '../utils/query'
import Button from './Button'
import Filter from './Filter'
import ProductCard from './ProductCard'

const ProductSpinner = (props: any) => {
	const [products, setProducts] = useState<Product[]>([])
	const [productsStack, setProductsStack] = useState<Product[][]>([])
	const [loading, setLoading] = useState(true)
	const [spins, setSpins] = useState(0)
	const [filterOpen, setFilterOpen] = useState(false)
	const [filter, setFilter] = useState<IFilter>({
		limit: 4,
		price_min: 0,
		price_max: 2000,
		categories: [],
	})
	const [range, setRange] = useState([filter.price_min, filter.price_max])

	const handleReturn = () => {
		const prev = [...productsStack].pop() as Product[]
		setProducts(prev)
		setProductsStack((stack) => [...stack].slice(0, stack.length - 1))
	}

	const findProducts = async (saveStack: boolean = true) => {
		setLoading(true)
		const response = await fetch(`/api/products?${serialize(filter)}`)
		const products = await response.json()
		setProducts((prev) => {
			if (prev.length != 0) setProductsStack((stack) => [...stack, prev])
			return (products)
		})
	}

	const handleSearch = () => {
		setSpins((prev) => prev + 1)
		findProducts()
	}

	useEffect(() => {
		findProducts(false)
	}, [])

	useEffect(() => {
		setLoading(false)
	}, [products])

	useEffect(() => {
		setFilter((prev) => ({
			...prev,
			price_min: range[0],
			price_max: range[1],
		}))
	}, [range])

	useEffect(() => {
		setSpins(0)
	}, [filter])

	return (
		<div>
			<Filter open={filterOpen} setOpen={setFilterOpen} range={range} setRange={setRange} />
			<div className={`flex flex-col h-full justify-between ${props.className}`}>
				<div className='grid grid-cols-2'>
					{products.map((product) => (
							<ProductCard key={product.handle} product={product} />
					))}
				</div>
				<div className="p-4 fixed bottom-0 w-full grid grid-cols-8">
					<div className="col-span-2 flex items-center justify-center">
						{productsStack.length != 0 && <Button onClick={() => handleReturn()} innerClass="text-xs px-5 py-4" label="B" />}
					</div>
					<Button className="col-span-4 w-full" innerClass="bg-theme-body w-full" onClick={() => handleSearch()} label={`${spins === 0 ? 'Søg' : 'Nah, prøv igen'}`} />
					<Button className="col-span-2 flex items-center justify-center" onClick={() => setFilterOpen(true)} innerClass="text-xs px-5 py-4" label="F"/>
				</div>
			</div>
		</div>
	)
}

export default ProductSpinner
