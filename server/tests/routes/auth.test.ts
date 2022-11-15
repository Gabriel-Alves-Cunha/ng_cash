import { describe, test, expect } from "vitest";

import { testServer } from "../setupTestServer";
import { log } from "../../src/utils";

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
		const response = await testServer
			.post("/auth/login")
			.send({ username: "Whatever", plainTextPassword: "12345678" });

		expect(response.body.message).toContain(
			"Senha deve conter pelo menos uma letra maiúscula."
		);
	});

	test("Testing wrong password without uppercase letter at 'auth/create-user'; should fail.", async () => {
		const response = await testServer
			.post("/auth/create-user")
			.send({ username: "Does Not Matter", plainTextPassword: "12345678" });

		expect(response.body.message).toContain(
			"Senha deve conter pelo menos uma letra maiúscula."
		);
	});

	test("Testing wrong password without number at 'auth/login'; should fail.", async () => {
		const response = await testServer
			.post("/auth/login")
			.send({ username: "Does Not Matter", plainTextPassword: "Abcdefgh" });
		console.log("Test response.body:", response.body);

		expect(response.body.message).toContain(
			"Senha deve conter pelo menos um número."
		);
	});

	test("Testing wrong password without number 'auth/create-user'; should fail", async () => {
		const response = await testServer
			.post("/auth/create-user")
			.send({ username: "Does Not Matter", plainTextPassword: "Abcdefgh" });

		expect(response.body.message).toContain(
			"Senha deve conter pelo menos um número."
		);
	});

	///////////////////////////////////////
	///////////////////////////////////////

	test.only("Testing creating user, should work", async () => {
		const response = await testServer.post("/auth/create-user").send(user);

		console.log("response:", response.body); // I'm on this!!

		expect(response.body).toHaveProperty("token");
	});

	test("Testing creating user, should fail username constraint", async () => {
		const response = await testServer.post("/auth/create-user").send(user);

		console.log("Should fail username constraint:", response.body);

		expect(response.body).toHaveProperty("token");
	});

	///////////////////////////////////////
	///////////////////////////////////////

	test("Testing login", async () => {
		const response = await testServer.post("/auth/login").send(user);

		log(response.body);

		expect(response.body).toHaveProperty("token");
	});
});
