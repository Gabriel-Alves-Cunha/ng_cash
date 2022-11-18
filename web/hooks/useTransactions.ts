import type { Transaction } from "../../server/src/@types/my-prisma-types";
import type { AxiosError } from "axios";

import useSWR from "swr";

import { api } from "lib/axios";

export function useTransactions(urlWithFilters: string) {
	const { data, error } = useSWR<TransactionResponse, AxiosError>(
		urlWithFilters
			? "/api/transactions-filtered?" + urlWithFilters
			: "/api/transactions",
		api
	);

	console.log("From useTransactions:", { data, error });

	return {
		transactions: {
			cash_out: data?.data?.cash_out ?? [],
			cash_in: data?.data?.cash_in ?? [],
		},
		error: data?.data?.message || error?.message,
		isLoading: !error && !data,
	};
}

interface TransactionResponse {
	data?: {
		cash_out: TransactionFromApi;
		cash_in: TransactionFromApi;
		message?: string;
	};
}

type TransactionFromApi = (Transaction & {
	CreditedAccountId: {
		User: {
			username: string;
		}[];
	};
	DebitedAccountId: {
		User: {
			username: string;
		}[];
	};
})[];
