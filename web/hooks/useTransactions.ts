import type { Transaction } from "../../server/src/@types/my-prisma-types";

import useSWR from "swr";

import { api } from "lib/axios";

export function useTransactions() {
	const { data: transactions, error, mutate } = useSWR<TransactionResponse>(
		"/api/transactions",
		api
	);

	return {
		isLoading: !error && !transactions,
		transactions,
		mutate,
		error,
	};
}

type TransactionResponse = {
	cash_out: Transaction[];
	cash_in: Transaction[];
	message?: string;
};
