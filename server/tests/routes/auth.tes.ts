import { describe, test, expect, beforeAll } from "vitest";
import { promisify } from "node:util";
import { exec } from "node:child_process";

import { testServer } from "../setupTestServer";

///////////////////////////////////////
///////////////////////////////////////

beforeAll(async () => {
	console.time("Reseting db");
	await promisify(exec)("yarn reset-database");
	console.timeEnd("Reseting db");
});

///////////////////////////////////////
///////////////////////////////////////

describe("Testing route '/auth/login' and 'auth/create-user'", () => {
	const user = {
		plainTextPassword: "A1234567",
		username: "Fulano Sicrano",
	};

	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing password without uppercase letter at 'auth/login'; should fail.", async () => {
		const res = await testServer
			.post("/auth/login")
			.send({ username: "Whatever", plainTextPassword: "12345678" });

		expect(res.body.message).toContain(
			"Senha deve conter pelo menos uma letra maiúscula."
		);
	});

	test("Testing wrong password without uppercase letter at 'auth/create-user'; should fail.", async () => {
		const res = await testServer
			.post("/auth/create-user")
			.send({ username: "Does Not Matter", plainTextPassword: "12345678" });

		expect(res.body.message).toContain(
			"Senha deve conter pelo menos uma letra maiúscula."
		);
	});

	test("Testing wrong password without number at 'auth/login'; should fail.", async () => {
		const res = await testServer
			.post("/auth/login")
			.send({ username: "Does Not Matter", plainTextPassword: "Abcdefgh" });

		expect(res.body.message).toContain(
			"Senha deve conter pelo menos um número."
		);
	});

	test("Testing wrong password without number 'auth/create-user'; should fail", async () => {
		const res = await testServer
			.post("/auth/create-user")
			.send({ username: "Does Not Matter", plainTextPassword: "Abcdefgh" });

		expect(res.body.message).toContain(
			"Senha deve conter pelo menos um número."
		);
	});

	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing creating user, should work", async () => {
		const res = await testServer.post("/auth/create-user").send(user);

		expect(res.body).toHaveProperty("token");
	});

	test("Testing creating user, should fail username constraint", async () => {
		const res = await testServer.post("/auth/create-user").send(user);

		expect(res.body.message).toContain(
			"Unique constraint failed on the fields: (`username`)"
		);
	});

	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing login", async () => {
		const res = await testServer.post("/auth/login").send(user);

		expect(res.body).toHaveProperty("token");
	});
});
