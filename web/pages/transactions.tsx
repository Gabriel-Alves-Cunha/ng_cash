import { Funnel } from "phosphor-react";
import { useRef } from "react";

import { DashboardLayout } from "components/DashboardLayout";
import { useTransactions } from "hooks/useTransactions";
import { centavos2reais } from "utils/centavos2reais";
import { Loading } from "components/Loading";
import { sleep } from "utils/sleep";
import { api } from "lib/axios";

export default function Transactions() {
	const { transactions, error, isLoading, mutate } = useTransactions();
	const orderByDateRef = useRef<HTMLInputElement>(null);
	const filterByRef = useRef<HTMLSelectElement>(null);
	const orderByRef = useRef<HTMLSelectElement>(null);

	console.log("Transactions =", { transactions, error, isLoading });

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

	const allTransaction = [...transactions.cash_in!, ...transactions.cash_out!];

	async function filterOrOrderBy() {
		await sleep(1_000);

		if (!filterByRef.current || !orderByRef.current || !orderByDateRef.current)
			return;

		const filter_by = filterByRef.current.value as "" | "cash_in" | "cash_out";
		const order_by = orderByRef.current.value as "asc" | "desc" | "";
		const additional_filter = orderByDateRef.current.checked;

		let querystring = "";

		if (additional_filter) querystring += "filter_by=date";

		if (order_by) {
			if (querystring) querystring += "&";

			querystring += "order_by=" + order_by;
		}

		if (filter_by) {
			if (querystring) querystring += "&";

			querystring += "additional_filter=" + filter_by;
		}

		console.log("querystring of filters =", querystring);

		if (!querystring) return;

		const res = await mutate(
			api.get("/api/transactions-filtered?" + querystring),
			{
				rollbackOnError: true,
				revalidate: true,
			}
		);

		console.log("Response of mutation:", res);
	}

	return (
		<div className="w-full h-full bg-dashboard-primary rounded-[30px] p-4 flex">
			<header className="bg-[rgba(47,128,237,0.05)] w-full h-14 p-2">
				<div className="w-9 h-full">{isLoading ? <Loading /> : null}</div>

				<label className="gap-2">
					<input
						onPointerUp={filterOrOrderBy}
						ref={orderByDateRef}
						type="checkbox"
					/>
					Order by date
				</label>

				<select
					className="[&_options]:hover:bg-[rgba(47,128,237,0.1)]"
					onBlur={filterOrOrderBy}
					name="Select filter"
					ref={filterByRef}
				>
					<option value="cash_in">Cash in</option>
					<option value="cash_out">Cash out</option>
				</select>

				<select
					onBlur={filterOrOrderBy}
					name="Select order"
					id="order-select"
					ref={orderByRef}
				>
					<option value="asc">Crescente</option>
					<option value="desc">Decrescente</option>
				</select>
			</header>

			<div className="flex flex-col">
				<header className="grid overflow-hidden grid-cols-4 grid-rows-5 gap-2 text-secondary rounded-xl p-3 h-16 bg-[rgba(47,128,237,0.1)]">
					<div>De</div>
					<div>Valor</div>
					<div>Para</div>
					<div>Data</div>
				</header>

				{allTransaction.map(tx => (
					<div
						className="grid overflow-hidden grid-cols-4 grid-rows-5 gap-2 text-secondary rounded-xl p-3 h-16"
						key={tx.id}
					>
						<div>{tx.CreditedAccountId.User[0].username}</div>
						<div>{centavos2reais(tx.value)}</div>
						<div>{tx.DebitedAccountId.User[0].username}</div>
						<div>{new Intl.DateTimeFormat("pt-BR").format(tx.createdAt)}</div>
					</div>
				))}
			</div>
		</div>
	);
}

Transactions.getLayout = function getLayout(page: JSX.Element) {
	return (
		<DashboardLayout buttonActivatedName="transactions">{page}</DashboardLayout>
	);
};
