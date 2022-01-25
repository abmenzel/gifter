import Image from "next/image"
import Product from "../interfaces/IProduct"

const ProductCard = ({product} : {product: Product}) => {

    const priceFormat = (price: number) => {
        return price.toLocaleString("da-DK")
    }

    return (
        <div className="p-4">
            <div className="relative aspect-square">
                <Image src={`/data/images/${product.handle}.png`} objectFit="cover" layout="fill"/>
            </div>
            <h3 className="font-heading text-theme-body text-sm h-10">{product.title.length > 30 ? `${product.title.slice(0,30)}...` : product.title}</h3>
            <p className="text-sm">{product.categories[product.categories.length - 1]}</p>
            <p className="text-sm">Set til {priceFormat(product.price)},-</p>
        </div>
    )
}

export default ProductCard