import type { Transaction } from "../../server/src/@types/my-prisma-types";
import type { AxiosError } from "axios";

import useSWR from "swr";

import { api } from "lib/axios";

export function useTransactions() {
	const { data, error, mutate } = useSWR<TransactionResponse, AxiosError>(
		"/api/transactions",
		api
	);

	return {
		transactions: {
			cash_out: data?.body?.cash_out,
			cash_in: data?.body?.cash_in,
		},
		error: data?.body?.message || error?.message,
		isLoading: !error && !data,
		mutate,
	};
}

interface TransactionResponse {
	body?: {
		cash_out: Transaction[];
		cash_in: Transaction[];
		message?: string;
	};
}
