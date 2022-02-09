import Image from "next/image"
import Product from "../interfaces/IProduct"
import { priceFormat } from "../utils/numbers"

const ProductCard = ({product} : {product: Product}) => {

    return (
        <div className="">
            <div className="relative aspect-square mb-2">
                <Image src={`/data/images/${product.handle}.png`} objectFit="cover" layout="fill"/>
            </div>
            <h3 className="font-heading text-theme-body text-sm h-10">{product.title.length > 30 ? `${product.title.slice(0,30)}...` : product.title}</h3>
            <p className="text-sm">{product.categories[product.categories.length - 1]}</p>
            <p className="text-sm">Set til {priceFormat(product.price)} kr.</p>
        </div>
    )
}

export default ProductCard