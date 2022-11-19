import { describe, test, expect, beforeAll } from "vitest";
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

let authToken = "";

beforeAll(async () => {
	console.time("Reseting db");
	await promisify(exec)("yarn reset-database");
	console.timeEnd("Reseting db");

	// Login with a user:
	try {
		const { body } = await testServer.post("/api/auth/login").send(user1_info);

		authToken = body.authToken;

		// console.error("User logged in! authToken =", authToken, "\nres.body =", body);
	} catch (error) {
		console.error("Error logging user at 'user.test.ts':", error);

		process.exit(1);
	}
});

///////////////////////////////////////
///////////////////////////////////////

describe("Testing route '/api/user/me'", () => {
	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing getting my user info", async () => {
		const res = await testServer
			.get("/api/user/me")
			.set({ Authorization: `Bearer ${authToken}` });

		expect(res.body.username).toEqual(user1_info.username);
		expect(res.body.balance).toEqual(140000);
	});
});
