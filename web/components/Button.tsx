export function Button({
	className,
	variant,
	title,
	Arrow,
	Icon,
	...props
}: Props) {
	return (
		<button
			className={
				`h-12 bg-button-${variant} text-white font-bold rounded-[5px] hover:bg-button-${variant}-hovered duration-200 ` +
				className
			}
			{...props}
		>
			{Icon ? Icon : <></>}
			{title}
			{Arrow ? Arrow : <></>}
		</button>
	);
}

interface Props
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	variant: "primary" | "secondary" | "aside";
	Arrow?: JSX.Element | undefined | null;
	Icon?: JSX.Element | undefined | null;
	title: string;
}
