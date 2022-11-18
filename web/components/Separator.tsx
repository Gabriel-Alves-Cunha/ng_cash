export const Separator = ({ className, ...props }: Props) => (
	<div className={`h-[1px] w-[80%] bg-gray-400 ` + className} {...props} />
);

type Props = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;
