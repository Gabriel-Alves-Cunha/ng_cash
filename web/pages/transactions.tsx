import { Funnel } from "phosphor-react";
import { useRef, useState } from "react";

import { DashboardLayout } from "components/DashboardLayout";
import { useTransactions } from "hooks/useTransactions";
import { centavos2reais } from "utils/centavos2reais";
import { Loading } from "components/Loading";

export default function Transactions() {
	const [urlWithFilters, setUrlWithFilters] = useState("");
	const { transactions, error, isLoading } = useTransactions(urlWithFilters);
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

	async function filterOrOrderBy() {
		if (!filterByRef.current || !orderByRef.current)
			return;

		const additional_filter = filterByRef.current.value as
			| ""
			| "cash_in"
			| "cash_out";
		const order_by = orderByRef.current.value as "asc" | "desc" | "all" | "";

		if ((!order_by || order_by === "all") && !additional_filter)
			return setUrlWithFilters("");

		let querystring = "";

		if (additional_filter)
			querystring += "additional_filter=" + additional_filter;

		if (order_by && order_by !== "all") {
			if (querystring) querystring += "&";

			querystring += "order_by=" + order_by;
		}

		if (querystring) querystring += "&";
		querystring += "filter_by=date";

		console.log("querystring of filters =", querystring);

		setUrlWithFilters(querystring);
	}

	return (
		<div className="w-full h-full bg-dashboard-primary rounded-[30px] p-4 flex flex-col gap-2">
			<header className="bg-[rgba(47,128,237,0.05)] w-full h-14 p-2 flex gap-3 justify-end rounded-[80px] items-center">
				<select
					className="border-[1px] border-gray-300 rounded-[60px] p-1 bg-transparent hover:bg-white cursor-pointer"
					onChange={filterOrOrderBy}
					name="Select filter"
					ref={filterByRef}
				>
					<option value="cash_in">Cash in</option>
					<option value="cash_out">Cash out</option>
				</select>

				<select
					className="border-[1px] border-gray-300 rounded-[60px] p-1 bg-transparent hover:bg-white cursor-pointer"
					onChange={filterOrOrderBy}
					name="Select order"
					id="order-select"
					ref={orderByRef}
				>
					<option value="all">Todos</option>
					<option value="asc">Crescente</option>
					<option value="desc">Decrescente</option>
				</select>
			</header>

			<div className="flex flex-col gap-1">
				<header className="grid overflow-hidden grid-cols-4 grid-rows-5 gap-2 text-secondary rounded-xl p-3 h-[50px] bg-[rgba(47,128,237,0.1)] w-full text-center">
					<div>De</div>
					<div>Valor</div>
					<div>Para</div>
					<div>Data</div>
				</header>

				{[...transactions.cash_in, ...transactions.cash_out].map(tx => (
					<div
						className="inline-grid overflow-hidden grid-cols-4 grid-rows-5 gap-2 text-secondary rounded-xl p-3 h-[50px] text-center leading-4"
						key={tx.id}
					>
						<div>{tx.CreditedAccountId.User[0]?.username}</div>
						<div>{tx.DebitedAccountId.User[0]?.username}</div>
						<div>{centavos2reais(tx.value)}</div>
						<div>
							{new Intl.DateTimeFormat("pt-BR", {
								minute: "numeric",
								second: "numeric",
								month: "numeric",
								year: "numeric",
								hour: "numeric",
								day: "numeric",
								hour12: false,
							}).format(new Date(tx.createdAt))}
						</div>
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
