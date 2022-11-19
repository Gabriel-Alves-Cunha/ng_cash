import { describe, expect, beforeAll, it } from "vitest";
import { promisify } from "node:util";
import { exec } from "node:child_process";

import { testServer } from "../setupTestServer";
import { log } from "#src/utils";

///////////////////////////////////////
///////////////////////////////////////

// The same from ../../prisma/seed.js
// vitest cannot import it :[
const user1_info = {
		plainTextPassword: "A2345678",
		username: "Fulano Alves",
	},
	user2_info = {
		plainTextPassword: "B2345678",
		username: "Sicrano Cunha",
	};

let authToken_user_1 = "",
	authToken_user_2 = "";

beforeAll(async () => {
	console.time("Reseting db");
	await promisify(exec)("yarn reset-database");
	console.timeEnd("Reseting db");

	// Login with a user:
	try {
		const user1 = await testServer.post("/api/auth/login").send(user1_info);

		authToken_user_1 = user1.body.authToken;

		const user2 = await testServer.post("/api/auth/login").send(user2_info);

		authToken_user_2 = user2.body.authToken;

		// console.error("User logged in! authToken =", authToken, "\nres.body =", authToken);
	} catch (error) {
		console.error("Error logging user at 'user.test.ts':", error);

		process.exit(1);
	}
});

///////////////////////////////////////
///////////////////////////////////////

describe("Testing route '/api/transactions'", () => {
	///////////////////////////////////////
	///////////////////////////////////////

	it("should be able to cash out at '/api/transactions/cash_out.", async () => {
		const res = await testServer
			.post("/api/transactions/cash-out")
			.send({
				username_to_cash_in_to: user2_info.username,
				amount_to_cash_out: 50_000,
			})
			.set({ Authorization: `Bearer ${authToken_user_1}` });

		expect(res.body.balance).toBe(90000);
		expect(res.body.success).toBe(true);
	});

	it("should be able to cash out at '/api/transactions/cash_out.", async () => {
		const res = await testServer
			.post("/api/transactions/cash-out")
			.send({
				username_to_cash_in_to: user1_info.username,
				amount_to_cash_out: 70_000,
			})
			.set({ Authorization: `Bearer ${authToken_user_2}` });

		expect(res.body.balance).toBe(40000);
		expect(res.body.success).toBe(true);
	});

	it("should get all transactions at '/api/transactions-filtered?filter_by=date&order_by=asc'.", async () => {
		const res = await testServer
			.get("/api/transactions-filtered?filter_by=date&order_by=asc")
			.set({ Authorization: `Bearer ${authToken_user_1}` });

		log("On filter by date and order asc:", res.body);

		expect(res.body.cash_out).toHaveLength(3);
		expect(res.body.cash_in).toHaveLength(3);
	});
});
