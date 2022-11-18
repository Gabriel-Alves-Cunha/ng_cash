import useSWR from "swr";

import { api } from "lib/axios";

export function useUser() {
	const { data: user, error } = useSWR<UserResponse>("/api/user/me", api);

	return {
		isLoading: !error && !user,
		error,
		user,
	};
}

type UserResponse = {
	message?: string;
	username: string;
	balance: number;
};
