import axios, { type AxiosError } from "axios";

export const api = axios.create({
	baseURL: "http://localhost:3456",
});

// Put authToken in headers:
api.interceptors.request.use(
	config => {
		const authToken = localStorage.getItem("authToken");

		if (authToken) {
			config.headers!["Authorization"] = `Bearer ${authToken}`;

			console.log("Token found ");
		}

		return config;
	},
	error => Promise.reject(error)
);

// If authToken is expired, send user back to login page:
api.interceptors.response.use(
	res => {
		return res;
	},
	async (err: AxiosError) => {
		const originalConfig = err.config;

		if (originalConfig?.url !== "/api/auth/login" && err.response) {
			// Auth Token was expired
			if (err.response.status === 401) {
				alert("Session time out. Please login again.");

				// Logging out the user by removing all the tokens from local
				localStorage.removeItem("authToken");

				// Redirecting the user to the landing page
				window.location.href = window.location.origin;

				return Promise.reject(err);
			}
		}

		return Promise.reject(err);
	}
);
