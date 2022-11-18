import { type IconProps, CaretRight } from "phosphor-react";

const BaseButton = ({ className, title, showArrow, Icon, ...props }: Props) => (
	<button
		className={
			"relative h-12 text-white font-bold rounded-[5px] duration-200 flex items-center justify-center " +
			className
		}
		{...props}
	>
		{Icon ? <Icon className="absolute left-4" size={20} /> : <></>}
		{title}
		{showArrow ? <CaretRight className="absolute right-4" size={20} /> : <></>}
	</button>
);

const Primary = ({ className = "", ...props }: Props) => (
	<BaseButton
		className={
			"bg-button-primary hover:bg-button-primary-hovered " +
			className
		}
		{...props}
	/>
);

const Secondary = ({ className = "", ...props }: Props) => (
	<BaseButton
		className={
			"bg-button-secondary hover:bg-button-secondary-hovered " + className
		}
		{...props}
	/>
);

const Aside = ({ className = "", ...props }: Props) => (
	<BaseButton
		className={"hover:bg-button-aside-hovered rounded-[50px] " + className}
		{...props}
	/>
);

export const Button = { Primary, Secondary, Aside };

interface Props
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	Icon?:
		| React.ForwardRefExoticComponent<
				IconProps & React.RefAttributes<SVGSVGElement>
		  >
		| undefined
		| null;
	showArrow?: boolean;
	title: string;
}
