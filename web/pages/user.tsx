import { DashboardLayout } from "components/DashboardLayout";
import { centavos2reais } from "utils/centavos2reais";
import { Loading } from "components/Loading";
import { useUser } from "hooks/useUser";

export default function User() {
	const { user, error, isLoading } = useUser();

	if (error)
		return (
			<div className="h-full w-full flex items-center justify-center text-xl font-normal">
				{error}
			</div>
		);

	if (isLoading)
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Loading />
			</div>
		);

	return (
		<div className="flex flex-col gap-6 text-accent text-lg font-medium">
			<div className="">
				Nome de usuário:{" "}
				<span className="text-secondary">{user.username!}</span>
			</div>

			<div className="">
				Balança:{" "}
				<span className="text-secondary">{centavos2reais(user.balance!)}</span>
			</div>
		</div>
	);
}

User.getLayout = function getLayout(page: JSX.Element) {
	return <DashboardLayout buttonActivatedName="user">{page}</DashboardLayout>;
};
