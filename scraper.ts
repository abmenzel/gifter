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
    PRODUCT_IMAGE: '.J_wqfv6jRA[itemprop="image"]'
}

const initScraper = async () => {
    const content = await fetchContent(SOURCE_URL)
    const product_urls = getProductUrls(content)
    for(let i = 0; i < product_urls.length; i++) {
        const product = await getProductDetails(product_urls[i])
        console.log(product)
        saveToFile('./data/products.json', product)
        await sleep(300)
    }
}

const fetchContent = async (url: string) => {
    const response = await axios.get(url)
    return response.data
}

const getProductUrls = (content: string) => {
    const $ = cheerio.load(content)
    const product_urls = $(SELECTORS.PRODUCT_URL).map((_, el) => $(el).attr('href')).get()
    return product_urls
}

const getProductDetails = async (product_url: string) => {
    const content = await fetchContent(`${BASE_URL}${product_url}`)
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

const saveToFile = (path: string, data: any) => {
    fs.writeFile(path, JSON.stringify(data), { flag: 'a+'}, (err: any) => {
        if(err) console.log(err)
    })
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
