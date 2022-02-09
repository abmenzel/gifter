import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ProductSpinner from '../components/ProductSpinner'

const Home: NextPage = () => {
	return (
		<div className="font-body text-gray-500 flex flex-col min-h-screen">
			<Head>
				<title>Gavemanden</title>
				<meta
					name='description'
					content='Find inspiration til din næste gave'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<header className='p-6 py-8'>
				<h1 className='font-heading text-theme-body font-extrabold text-5xl'>Gavemanden</h1>
				<p className='text-xl pt-2'>
					Hjælper dig med inspiration til gaven til mor, far, søster, bror eller din ven som har fødselsdag i morgen.
				</p>
			</header>
			<ProductSpinner className="flex-grow" />
		</div>
	)
}

export default Home
