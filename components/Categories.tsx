import { useEffect, useState } from 'react'
import IFilter from '../interfaces/IFilter'
import Product from '../interfaces/IProduct'
import { serialize } from '../utils/query'
import shuffle from '../utils/shuffle'
import Category from './Category'

const Categories = (props:any) => {
    const { setCategories } = props
	const [allCategories, setAllCategories] = useState<string[]>([])
    const [displayedCategories, setDisplayedCategories] = useState<string[]>([])
    const [activeCategories, setActiveCategories] = useState<string[]>([])

	const fetchAndSetCategories = async () => {
		const filter: IFilter = {
			limit: -1,
			price_min: 0,
			price_max: 2000,
			categories: [],
		}
		const response = await fetch(`/api/products?${serialize(filter)}`)
		const products = await response.json()
		const allCat = new Set(
			products.map((product: Product) => product.categories).flat()
		)
		setAllCategories(Array.from(allCat) as string[])
        setDisplayedCategories(shuffle(Array.from(allCat)).slice(0,5) as string[])
	}

    const handleSearch = (e:any) => {
        const input = e.target.value
        console.log("search", input)
        const newCategories = allCategories.filter((category:string) => category.toLowerCase().includes(input.toLowerCase()))
        console.log(newCategories)
        setDisplayedCategories(newCategories.slice(0,5))
    }

	useEffect(() => {
		fetchAndSetCategories()
	}, [])

    useEffect(() => {
        setCategories(activeCategories)
    }, [activeCategories])

	return (
		<div className="h-48">
			<input onChange={(e) => handleSearch(e)} className="border-b w-full pb-1 mb-4 appearance-none outline-none" type='search' placeholder='Søg' />
			<div className='flex flex-wrap'>
				{displayedCategories.map((category: string) => (
					<Category key={category} category={category} activeCategories={activeCategories} setActiveCategories={setActiveCategories} />
				))}
			</div>
		</div>
	)
}

export default Categories
