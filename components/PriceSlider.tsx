import { Range } from 'react-range'

const PriceSlider = () => {
    return (
        <Range 
        step={0.1}
        min={0}
        max={100_000}
        values={range}
        onChange={(values) => {
            setRange(values)
        }}
    />
    )
}

export default PriceSlider