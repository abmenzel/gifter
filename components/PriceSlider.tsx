import { useState } from 'react'
import { Range } from 'react-range'
import { priceFormat } from '../utils/numbers'

const PriceSlider = ({
	range,
	setRange,
}: {
	range: number[]
	setRange: any
}) => {
    const max = 2000
	return (
		<div>
			<Range
				step={25}
				min={0}
				max={max}
				values={range}
				onChange={(values) => setRange(values)}
				renderTrack={({ props, children }) => (
					<div {...props} className='w-full h-1 bg-gray-200'>
						{children}
					</div>
				)}
				renderThumb={({ props }) => (
					<div
						{...props}
						className='rounded-full h-5 w-5 bg-theme-primary'
					/>
				)}
			/>
            <div className="flex justify-between mt-3 text-sm">
                <p>{priceFormat(range[0])} kr.</p>
                <p>{range[1] === max ? 'Den rige onkel' : `${priceFormat(range[1])} kr.`}</p>
            </div>
		</div>
	)
}

export default PriceSlider
