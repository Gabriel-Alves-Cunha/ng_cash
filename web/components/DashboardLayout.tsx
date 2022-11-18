import {
	ArrowsLeftRight,
	CaretRight,
	SignOut,
	Barcode,
	User,
} from "phosphor-react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Separator } from "./Separator";
import { Button } from "./Button";
import { api } from "lib/axios";

import logo from "../public/logo.svg";

export function DashboardLayout({ children, buttonActivatedName }: Props) {
	const router = useRouter();

	const gotoTransactions = async () => await router.push("/transactions");
	const gotoUser = async () => await router.push("/user");
	const gotoMakeTransactions = async () =>
		await router.push("/make-transaction");

	async function logout() {
		api.defaults.headers.common["Authorization"] = undefined;

		await router.push("/");
	}

	return (
		<div className="flex h-screen w-screen bg-dashboard-primary">
			<aside className="flex flex-col w-96">
				<Image src={logo} alt="NG.Cash's logo with a risc below it." />

				<Button
					className={
						"mt-9 " +
						(buttonActivatedName === "user" ? "bg-button-aside-hovered" : "")
					}
					Arrow={
						buttonActivatedName === "user" ? <CaretRight size={32} /> : null
					}
					Icon={<User size={32} />}
					onClick={gotoUser}
					title="User info"
					variant="aside"
				/>

				<Button
					className={
						buttonActivatedName === "transactions" ? "bg-button-aside-hovered" : ""
					}
					Arrow={
						buttonActivatedName === "transactions" ? <CaretRight size={32} /> : null
					}
					Icon={<ArrowsLeftRight size={32} />}
					onClick={gotoTransactions}
					title="Transactions"
					variant="aside"
				/>

				<Button
					className={
						buttonActivatedName === "make-transaction"
							? "bg-button-aside-hovered"
							: ""
					}
					Arrow={
						buttonActivatedName === "make-transaction" ? (
							<CaretRight size={32} />
						) : null
					}
					onClick={gotoMakeTransactions}
					Icon={<Barcode size={32} />}
					title="Make transation"
					variant="aside"
				/>

				<Separator className="my-6" />

				<Button
					Icon={<SignOut size={32} />}
					variant="secondary"
					onClick={logout}
					title="Deslogar"
				/>
			</aside>

			<main className="bg-dashboard-secondary h-full w-full m-5 ml-0 p-7 rounded-[30px]">
				{children}
			</main>
		</div>
	);
}

type Props = {
	buttonActivatedName: "user" | "transactions" | "make-transaction";
	children: React.ReactNode;
};
