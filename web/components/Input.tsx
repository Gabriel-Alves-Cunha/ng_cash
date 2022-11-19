export function Input({ className, ...props }: Props) {
	return (
		<input
			className={
				"mt-3 h-12 border-lightgray rounded-[5px] border-solid border-[1px] px-5 py-2 " +
				className
			}
			{...props}
		/>
	);
}

type Props = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;
