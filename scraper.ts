import axios from 'axios'
import cheerio from 'cheerio'
import Product from './interfaces/IProduct'
import fs from 'fs'

const BASE_URL = 'https://www.pricerunner.dk'
const SOURCE_URL = 'https://www.pricerunner.dk/cl/1220/Basketball?attr_50046654=59332329'
const SELECTORS = {
    PRODUCT_URL: '.SXMk5Voq8q a',
    PRODUCT_TITLE: 'h1',
    PRODUCT_PRICE: '[property="product:price"]',
    PRODUCT_CATEGORIES: '[itemprop="itemListElement"] span',
    PRODUCT_IMAGE: '.J_wqfv6jRA[itemprop="image"]',
    TOP_CATEGORY: '.ksIhNUfEHK',
    SECOND_CATEGORY: '.GfTesIWUYX a'
}
const DATA_PATH = './data' 
const PRODUCTS_PATH = './data/products.json' 
const IMAGES_PATH = './data/images' 

const initScraper = async () => {
    initData() 
    const response = await axios.get(BASE_URL)
    const top_categories = getTopCategories(response.data)

    for(let i = 0; i < top_categories.length; i++) {
        const cat_response = await axios.get(`${BASE_URL}${top_categories[i]}`)
        const secondary_categories = getSecondaryCategories(cat_response.data)
        for(let j = 0; j < secondary_categories.length; j++) {
            const response = await axios.get(`${BASE_URL}${secondary_categories[j]}`)
            const product_urls = getProductUrls(response.data)
            for(let k = 0; k < product_urls.length; k++) {
                const product = await getProductDetails(product_urls[k])
                storeProduct(product)
                await storeProductImage(product)
            }
        }
    }
}

const getTopCategories = (content: string) => {
    const $ = cheerio.load(content)
    const urls = $(SELECTORS.TOP_CATEGORY).map((_, el) => $(el).attr('href')).get()
    return urls
}

const getSecondaryCategories = (content: string) => {
    const $ = cheerio.load(content)
    const urls = $(SELECTORS.SECOND_CATEGORY).map((_, el) => $(el).attr('href')).get()
    return urls
}

const getProductUrls = (content: string) => {
    const $ = cheerio.load(content)
    const product_urls = $(SELECTORS.PRODUCT_URL).map((_, el) => $(el).attr('href')).get()
    return product_urls
}

const getProductDetails = async (product_url: string) => {
    const response = await axios.get(`${BASE_URL}${product_url}`)
    const content = response.data
    const $ = cheerio.load(content)

    const product: Product = {
        handle: handleize($(SELECTORS.PRODUCT_TITLE).text()),
        title: $(SELECTORS.PRODUCT_TITLE).text(),
        price: parseNumber($(SELECTORS.PRODUCT_PRICE).attr('content') as string),
        categories: $(SELECTORS.PRODUCT_CATEGORIES).map((_, el) => $(el).text()).get(),
        url: `${BASE_URL}${product_url}`,
        image_url: $(SELECTORS.PRODUCT_IMAGE).attr('src') as string
    }
    return product
}

const storeProductImage = async (product: Product) => {
    const response = await axios.get(product.image_url, { responseType: 'stream' })
    response.data.pipe(fs.createWriteStream(`${IMAGES_PATH}/${product.handle}.jpg`))
}

const initData = () => {
    if(!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH)
    if(!fs.existsSync(PRODUCTS_PATH) || fs.readFileSync(PRODUCTS_PATH).toString() === '') {
        fs.writeFileSync(PRODUCTS_PATH, '{}')
    }
    if(!fs.existsSync(IMAGES_PATH)) fs.mkdirSync(IMAGES_PATH)
}

const storeProduct = (product: Product) => {
    try {
        const data = fs.readFileSync(PRODUCTS_PATH).toString()
        const products = JSON.parse(data)
        if(!products[product.handle]){
            products[product.handle] = product
            fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products))
        }
    } catch (error) {
        console.error(error)
    }
}

const parseNumber = (number:string): number => {
    const formatted = number.replace(/\./gm, '')
    if(parseInt(formatted)) return parseInt(formatted)
    else return 0
}

const handleize = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '')
}

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

initScraper()
