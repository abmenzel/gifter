import { useState } from 'react'

const Button = ({
	onClick,
	className,
    innerClass,
	children
}: {
	className?: string
	onClick?: any
    innerClass?: string,
	children?: any
}) => {
	const [tapped, setTapped] = useState(false)
	return (
		<div
			className={`${tapped ? 'animate-tap' : ''} ${className}`}
            onAnimationEnd={() => setTapped(false)}
			onClick={() => setTapped(true)}>
			<button
				className={`scale-100 outline-none rounded-full px-6 py-4 bg-theme-primary font-bold text-white text-center block ${innerClass}`}
				onClick={onClick}>
				{children}
			</button>
		</div>
	)
}

export default Button
