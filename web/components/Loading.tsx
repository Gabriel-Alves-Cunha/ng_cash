export const Loading = ({ className = "", ...props }: Props) => (
	<div className={"lds-roller " + className} {...props}>
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
	</div>
);

type Props = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;
