import type { AxiosError } from "axios";

import useSWR from "swr";

import { api } from "lib/axios";

export function useUser() {
	const { data, error } = useSWR<UserResponse, AxiosError>("/api/user/me", api);

	return {
		user: {
			username: data?.data?.username,
			balance: data?.data?.balance,
		},
		error: data?.data?.message || error?.message,
		isLoading: !error && !data,
	};
}

interface UserResponse {
	data?: {
		message?: string;
		username: string;
		balance: number;
	};
}
