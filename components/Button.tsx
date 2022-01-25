import { useState } from 'react'

const Button = ({
	label,
	onClick,
	className,
}: {
	label: string
	className?: string
	onClick?: any
}) => {
	const [tapped, setTapped] = useState(false)
	return (
		<div
			className={`${tapped ? 'animate-tap' : ''}`}
            onAnimationEnd={() => setTapped(false)}
			onClick={() => setTapped(true)}>
			<button
				className={`scale-100 outline-none rounded-full px-8 py-4 bg-theme-primary font-bold text-white text-center block ${className}`}
				onClick={onClick}>
				{label}
			</button>
		</div>
	)
}

export default Button
