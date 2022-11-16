import { describe, expect, beforeAll, it } from "vitest";
import { promisify } from "node:util";
import { exec } from "node:child_process";

import { testServer } from "../setupTestServer";

///////////////////////////////////////
///////////////////////////////////////

// The same from ../../prisma/seed.js
// vitest cannot import it :[
const user1_info = {
	plainTextPassword: "A2345678",
	username: "Fulano Alves",
};

let token = "";

beforeAll(async () => {
	console.time("Reseting db");
	await promisify(exec)("yarn reset-database");
	console.timeEnd("Reseting db");

	// Login with a user:
	try {
		const { body } = await testServer.post("/api/auth/login").send(user1_info);

		token = body.token;

		// console.error("User logged in! token =", token, "\nres.body =", body);
	} catch (error) {
		console.error("Error logging user at 'user.test.ts':", error);

		process.exit(1);
	}
});

///////////////////////////////////////
///////////////////////////////////////

describe("Testing route '/api/transaction'", () => {
	///////////////////////////////////////
	///////////////////////////////////////

	it("should be able to cash out at '/api/transactions'.", async () => {
		const res = await testServer
			.post("/api/transactions/cash-out")
			.send({})
			.set({ Authorization: `Bearer ${token}` });

		expect(res.body.message).toContain(
			"Senha deve conter pelo menos uma letra maiúscula."
		);
	});

	it("should be able to cash out at '/api/transactions'.", async () => {
		const res = await testServer
			.get("/api/transactions")
			.set({ Authorization: `Bearer ${token}` });

		expect(res.body.message).toContain(
			"Senha deve conter pelo menos uma letra maiúscula."
		);
	});
});
