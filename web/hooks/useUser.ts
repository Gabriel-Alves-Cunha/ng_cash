import type { AxiosError } from "axios";

import useSWR from "swr";

import { api } from "lib/axios";

export function useUser() {
	const { data, error } = useSWR<UserResponse, AxiosError>("/api/user/me", api);

	return {
		user: {
			username: data?.body?.username,
			balance: data?.body?.balance,
		},
		error: data?.body?.message || error?.message,
		isLoading: !error && !data,
	};
}

interface UserResponse {
	body?: {
		username: string;
		balance: number;
		message?: string;
	};
}
