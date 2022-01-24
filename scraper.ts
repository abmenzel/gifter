import axios from 'axios'
import cheerio from 'cheerio'
import Product from './interfaces/IProduct'
import fs from 'fs'

const BASE_URL = 'https://www.pricerunner.dk'
const SELECTORS = {
    PRODUCT_URL: '.SXMk5Voq8q a',
    PRODUCT_TITLE: 'h1',
    PRODUCT_PRICE: '[property="product:price"]',
    PRODUCT_CATEGORIES: '[itemprop="itemListElement"] span',
    PRODUCT_IMAGE: '.J_wqfv6jRA[itemprop="image"]',
    TOP_CATEGORY: '.ksIhNUfEHK',
    SECOND_CATEGORY: '.QDScX6Pol4 a, .GfTesIWUYX a'
}
const DATA_PATH = './data' 
const PRODUCTS_PATH = './data/products.json'
const PRODUCT_URLS_PATH = './data/product_urls.json'
const PRODUCTS_SCRAPED_PATH = './data/products_scraped.json'
const IMAGES_PATH = './data/images' 

/**
 * The scraper will go from the top category -> secondary category -> tertiary category -> product
 * @returns 
 */
const Scrape = async (initial_scrape: boolean = false, scrape_products: boolean = true) => {
    initData() 
    if(initial_scrape) {
        const product_urls = await findProductURLs()
        fs.writeFileSync(PRODUCT_URLS_PATH, JSON.stringify(Array.from(product_urls as Set<string>)))
    }

    if(scrape_products){
        const product_urls = JSON.parse(fs.readFileSync(PRODUCT_URLS_PATH).toString())
        const products_scraped = new Set(JSON.parse(fs.readFileSync(PRODUCTS_SCRAPED_PATH).toString()))
        const remaining_urls: Set<string> = new Set(product_urls.filter((url:string) => !products_scraped.has(url)))
        const rem_urls_array: string[] = Array.from(remaining_urls)
        const chunks = chunk(rem_urls_array, 30)

        for(let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]
            await Promise.all(chunk.map(async (url: string) => {
                try {
                    const product = await getProductDetails(url)
                    if(!product) return
                    products_scraped.add(url)
                    remaining_urls.delete(url)
                    storeProduct(product)
                    await storeProductImage(product)
                }
                catch (error){
                    console.error(error)
                }
            }))
            console.log(`Finished chunk ${i} out of ${chunks.length}`)
        }
        
        /*for(let i = 0; i < rem_urls_array.length; i++) {
            try {
                //console.log(rem_urls_array[i])
                const product = await getProductDetails(rem_urls_array[i])
                if(!product) return
                products_scraped.add(rem_urls_array[i])
                remaining_urls.delete(rem_urls_array[i])
                storeProduct(product)
                await storeProductImage(product)
            }catch(error){
                console.error(rem_urls_array[i])
                console.error(error)
            }
        }
        fs.writeFileSync(PRODUCTS_SCRAPED_PATH, JSON.stringify(Array.from(products_scraped)))*/
    }
}

const chunk = (arr: any[], chunkSize: number) => {
    const chunks = Array.from({length: Math.ceil(arr.length / chunkSize)}, (v, i) => arr.slice(i * chunkSize, i * chunkSize + chunkSize))
    return chunks
}

const findProductURLs = async () => {
    const response = await axios.get(BASE_URL)
    const top_categories = getURLs(response.data, SELECTORS.TOP_CATEGORY)
    const product_urls = new Set<string>()
    const scraped_urls = new Set<string>()
    if(!top_categories) return

    const extract_product_urls = async (urls: string[]) => {
        //console.log(`Exploring ${urls}`)
        for(let i = 0; i < urls.length; i++) {
            if(scraped_urls.has(urls[i])) continue
            scraped_urls.add(urls[i])
            if(urls[i].includes('/t/')) {
                try {
                    const response = await axios.get(`${BASE_URL}${urls[i]}`)
                    const sub_links = getURLs(response.data, SELECTORS.SECOND_CATEGORY)
                    if(!sub_links) continue
                    extract_product_urls(sub_links)
                } catch (error) {
                    console.error(`${urls[i]}`)
                    console.error(error)
                }

            }else if (urls[i].includes('/cl/')) {
                try{
                    const response = await axios.get(`${BASE_URL}${urls[i]}`)
                    const sub_links = getURLs(response.data, SELECTORS.PRODUCT_URL)
                    if(!sub_links) continue
                    extract_product_urls(sub_links)
                } catch (error) {
                    console.error(`${urls[i]}`)
                    console.error(error)
                }
            }else if (urls[i].includes('/pl/')){
                if(product_urls.has(urls[i])) continue
                product_urls.add(urls[i])
            }
        }
    }
    
    await extract_product_urls(top_categories)
    console.log("Finished extracting product urls")
    return product_urls
}

const getURLs = (content: string, selector: string) => {
    try {
        const $ = cheerio.load(content)
        const urls = $(selector).map((_, el) => $(el).attr('href')).get()
        return urls
    }
    catch(error){
        console.error(error)
    }
}

const getProductDetails = async (product_url: string) => {
    try{
        const response = await axios.get(`${BASE_URL}${product_url}`)
        const content = response.data
        const $ = cheerio.load(content)
    
        const product: Product = {
            handle: handleize($(SELECTORS.PRODUCT_TITLE).text()),
            title: $(SELECTORS.PRODUCT_TITLE).text(),
            price: parseNumber($(SELECTORS.PRODUCT_PRICE).attr('content') as string),
            categories: $(SELECTORS.PRODUCT_CATEGORIES).map((_, el) => $(el).text()).get(),
            url: encodeURI(`${BASE_URL}${product_url}`),
            image_url: encodeURI($(SELECTORS.PRODUCT_IMAGE).attr('src') as string)
        }
        return product
    }
    catch (error){
        console.info(product_url)
        console.error(error)
    }
}    

const storeProductImage = async (product: Product) => {
    try{
        const response = await axios.get(product.image_url, { responseType: 'stream' })
        response.data.pipe(fs.createWriteStream(`${IMAGES_PATH}/${product.handle}.png`))
    }catch(error){
        console.info(product)
        console.error(error)
    }
}

const initData = () => {
    if(!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH)
    if(!fs.existsSync(PRODUCTS_PATH) || fs.readFileSync(PRODUCTS_PATH).toString() === '') {
        fs.writeFileSync(PRODUCTS_PATH, '{}')
    }
    if(!fs.existsSync(IMAGES_PATH)) fs.mkdirSync(IMAGES_PATH)
    if(!fs.existsSync(PRODUCTS_SCRAPED_PATH)) fs.writeFileSync(PRODUCTS_SCRAPED_PATH, '[]')
    if(!fs.existsSync(PRODUCT_URLS_PATH)) fs.writeFileSync(PRODUCT_URLS_PATH, '[]')

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
        console.info(product)
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

Scrape()
