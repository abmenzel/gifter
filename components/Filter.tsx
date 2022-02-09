import { Dialog, Transition } from '@headlessui/react'
import Button from './Button'
import Categories from './Categories'
import PriceSlider from './PriceSlider'

const Filter = ({
	open,
	setOpen,
	range,
	setRange,
	setCategories
}: {
	open: boolean
	setOpen: any
	range: number[]
	setRange: any
	setCategories: any
}) => {
	return (
		<Transition show={open}>
			<Dialog
				className='fixed inset-0 overflow-y-auto z-10 px-4'
				open={open}
				onClose={() => setOpen(false)}>
				<div className='flex items-center justify-center min-h-screen'>
					<Transition.Child
						enter='transition-opacity ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='transition-opacity ease-out duration-300'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<Dialog.Overlay className='fixed inset-0 z-10 bg-black opacity-20' />
					</Transition.Child>
					<Transition.Child
						enter='transition-all ease-out duration-300'
						enterFrom='scale-90 opacity-0'
						enterTo='scale-100 opacity-100'
						leave='transition-all ease-out duration-300'
						leaveFrom='scale-100 opacity-100'
						leaveTo='scale-90 opacity-0'
						className="w-full"
						>
						<div className='relative z-10 bg-white rounded-lg max-w-sm mx-auto px-8 py-6'>
							<Dialog.Title className='font-bold font-heading text-theme-body mb-4'>
								Hvad er budgettet?
							</Dialog.Title>
							<div className='w-full'>
								<PriceSlider
									range={range}
									setRange={setRange}
								/>
							</div>
							<Dialog.Title className='mt-4 font-bold font-heading text-theme-body mb-4'>
								Noget specielt?	
							</Dialog.Title>
							<Categories setCategories={setCategories} />
							<Button
								className='mt-12'
								innerClass='bg-theme-body text-sm mx-auto'
								onClick={() => setOpen(false)}
							>Lad os prøve det</Button>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}

export default Filter
