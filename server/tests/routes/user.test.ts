import { describe, test, expect, beforeAll, it } from "vitest";
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

describe.skip("Testing route '/api/user/me' and '/api/user/balance'", () => {
	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing getting my user info", async () => {
		const res = await testServer
			.get("/api/user/me")
			.set({ Authorization: `Bearer ${token}` });

		expect(res.body.user.username).toEqual(user1_info.username);
	});

	test("Testing getting balance", async () => {
		const res = await testServer
			.get("/api/user/balance")
			.set({ Authorization: `Bearer ${token}` });

		expect(res.body.balance).toEqual(100_000);
	});
});
