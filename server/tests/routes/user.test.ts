import { describe, test, expect, beforeAll } from "vitest";
import { promisify } from "node:util";
import { exec } from "node:child_process";

import { testServer } from "../setupTestServer";

///////////////////////////////////////
///////////////////////////////////////

// The same from ../../prisma/seed.js
// vitest cannot import it :[
const user1_info = {
		hashedPassword: "A2345678",
		username: "Fulano Alves",
	},
	user2_info = {
		hashedPassword: "B2345678",
		username: "Sicrano Cunha",
	};

let token = "";

beforeAll(async () => {
	console.time("Reseting db");
	await promisify(exec)("yarn reset-database");
	console.timeEnd("Reseting db");

	// Login with a user:
	try {
		const res = await testServer
			.post("/auth/login")
			.send(user1_info)
			.auth(token, { type: "bearer" });

		token = res.body.token;

		console.error("User logged in! token =", token, "\nres.body =", res.body);
	} catch (error) {
		console.error(error);

		process.exit(1);
	}
});

///////////////////////////////////////
///////////////////////////////////////

describe("Testing route '/user/me' and 'user/balance'", () => {
	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing getting my user info", async () => {
		const res = await testServer
			.get("/user/me")
			.set({ Authorization: `Bearer ${token}` });

		console.log("res.body:", res.body);

		expect(res.body.user.username).toEqual(user1_info.username);
	});

	test("Testing getting balance", async () => {
		const res = await testServer
			.get("/user/balance")
			.set({ Authorization: `Bearer ${token}` });

		console.log("balance res.body:", res.body);

		expect(res.body.balance).toEqual(100_000);
	});
});
