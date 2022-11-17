import type { User, Account } from "../../server/src/@types/my-prisma-types";

import useSWR from "swr";

import { api } from "lib/axios";

export function useUser() {
	const { data: user, error } = useSWR<User & Account>("/api/user/me", api);

	return {
		isLoading: !error && !user,
		error,
		user,
	};
}
