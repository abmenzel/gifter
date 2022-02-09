import { useEffect, useState } from "react"

const Category = (props: any) => {
    const {category, initialState, activeCategories, setActiveCategories} = props
    const [active, setActive] = useState(initialState)

    const handleClick = () => {
        setActive(!active)
    }

    useEffect(() => {
        setActiveCategories(active ? [...activeCategories, category] : activeCategories.filter((c:any) => c !== category))
    }, [active])

    return (
        <div onClick={() => handleClick()} className={`${active ? 'bg-theme-body text-white' : 'bg-transparent text-theme-body'} cursor-pointer border-2 border-theme-body rounded-full text-center mr-2 mb-2 px-4 py-1 text-sm`}>
            {category}
        </div>
    )  
}

export default Category