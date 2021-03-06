import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import IconBack from '../icons/IconBack'
import IconFilter from '../icons/IconFilter'
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
	const [categories, setCategories] = useState<string[]>([])

	const handleReturn = () => {
		const prev = [...productsStack].pop() as Product[]
		setProducts(prev)
		setProductsStack((stack) => [...stack].slice(0, stack.length - 1))
	}

	const findProducts = async () => {
		setLoading(true)
		const response = await fetch(`/api/products?${serialize(filter)}`)
		const products = await response.json()
		setProducts((prev) => {
			if (prev.length != 0) setProductsStack((stack) => [...stack, prev])
			return products
		})
	}

	const handleSearch = () => {
		setSpins((prev) => prev + 1)
		findProducts()
	}

	useEffect(() => {
		findProducts()
	}, [])

	useEffect(() => {
		setLoading(false)
	}, [products])

	useEffect(() => {
		setFilter((prev) => ({
			...prev,
			price_min: range[0],
			price_max: range[1],
			categories: categories
		}))
	}, [range, categories])

	useEffect(() => {
		setSpins(0)
		console.log(filter)
	}, [filter])

	return (
		<div>
			<Filter
				open={filterOpen}
				setOpen={setFilterOpen}
				range={range}
				setRange={setRange}
				setCategories={setCategories}
			/>
			<div
				className={`flex flex-col h-full justify-between ${props.className}`}>
				<div className='grid grid-cols-2 gap-6 p-6'>
					{products.map((product) => (
						<ProductCard key={product.handle} product={product} />
					))}
				</div>
				<div className='p-4 fixed bottom-0 w-full grid grid-cols-8'>
					<div className='col-span-2 flex items-center justify-center'>
						{productsStack.length != 0 && (
							<Button
								onClick={() => handleReturn()}
								className=''
								innerClass='text-xs px-3 py-3'>
								<IconBack className='h-5 w-5' />
							</Button>
						)}
					</div>
					<Button
						className='col-span-4 w-full'
						innerClass='bg-theme-body w-full'
						onClick={() => handleSearch()}>
						{spins === 0 ? 'S??g' : 'Nah, pr??v igen'}
					</Button>
					<div className='col-span-2 flex items-center justify-center'>
						<Button
							onClick={() => setFilterOpen(true)}
							innerClass='text-xs px-3 py-3'>
							<IconFilter className='h-5 w-5' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductSpinner
