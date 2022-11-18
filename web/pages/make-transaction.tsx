import { DashboardLayout } from "components/DashboardLayout";
import { Loading } from "components/Loading";
import { useUser } from "hooks/useUser";
import { Button } from "components/Button";

export default function MakeTransaction() {
	// 	const { user, error } = useUser();
	//
	// 	if (error || user?.message)
	// 		return (
	// 			<div className="h-full w-full flex items-center justify-center text-xl font-normal">
	// 				{error.message || user?.message}
	// 			</div>
	// 		);
	//
	// 	if (!user)
	// 		return (
	// 			<div className="h-full w-full flex items-center justify-center">
	// 				<Loading />
	// 			</div>
	// 		);
	//
	// 	console.log("User =", user);

	return (
		<div className="">
			<div className=""></div>

			<div className=""></div>
		</div>
	);
}

MakeTransaction.getLayout = function getLayout(page: JSX.Element) {
	return (
		<DashboardLayout buttonActivatedName="make-transaction">
			{page}
		</DashboardLayout>
	);
};
