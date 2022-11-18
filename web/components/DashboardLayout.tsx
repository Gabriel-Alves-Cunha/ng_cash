import { ArrowsLeftRight, SignOut, Barcode, User } from "phosphor-react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Separator } from "./Separator";
import { Button } from "./Button";

import logo from "../public/logo.svg";

export function DashboardLayout({ children, buttonActivatedName }: Props) {
	const router = useRouter();

	const gotoTransactions = async () => await router.push("/transactions");
	const gotoUser = async () => await router.push("/user");
	const gotoMakeTransactions = async () =>
		await router.push("/make-transaction");

	async function logout() {
		localStorage.removeItem("authToken");

		await router.push("/");
	}

	return (
		<div className="flex h-screen w-screen bg-dashboard-primary overflow-hidden">
			<aside className="flex flex-col w-96 p-9 gap-2">
				<Image
					className="bg-black box-content p-3 w-20 h-14 rounded-xl mx-auto"
					alt="NG.Cash's logo with a risc below it."
					src={logo}
				/>

				<Button.Aside
					className={
						"mt-11 text-sm text-gray-400 font-normal " +
						(buttonActivatedName === "user"
							? "bg-button-aside-hovered text-selected border-selected border-[1px] font-normal"
							: "")
					}
					showArrow={buttonActivatedName === "user"}
					onClick={gotoUser}
					title="User info"
					Icon={User}
				/>

				<Button.Aside
					className={
						(buttonActivatedName === "transactions"
							? "bg-button-aside-hovered text-sm text-selected border-selected border-[1px] font-normal"
							: "") + "text-sm text-gray-400 font-normal"
					}
					showArrow={buttonActivatedName === "transactions"}
					onClick={gotoTransactions}
					Icon={ArrowsLeftRight}
					title="Transactions"
				/>

				<Button.Aside
					className={
						(buttonActivatedName === "make-transaction"
							? "bg-button-aside-hovered text-sm text-selected border-selected border-[1px] font-normal"
							: "") + "text-sm text-gray-400 font-normal"
					}
					showArrow={buttonActivatedName === "make-transaction"}
					onClick={gotoMakeTransactions}
					title="Make transation"
					Icon={Barcode}
				/>

				<Separator className="my-6 mx-auto" />

				<Button.Secondary
					className="mt-auto"
					onClick={logout}
					Icon={SignOut}
					title="Sair"
				/>
			</aside>

			<main className="bg-dashboard-secondary h-full max-h-full max-w-full w-full m-5 ml-0 p-7 rounded-[30px]">
				{children}
			</main>
		</div>
	);
}

type Props = {
	buttonActivatedName: "user" | "transactions" | "make-transaction";
	children: React.ReactNode;
};
