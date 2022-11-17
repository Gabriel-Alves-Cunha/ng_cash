import type { ZodError } from "zod";

import { describe, expect, it } from "vitest";

import { userFromBody } from "src/validation/user";

describe("Testing userFromBody validation", () => {
	it("should fail username too small", () => {
		try {
			userFromBody.parse({ username: "ab" });
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain("Nome de usuário deve ter pelo menos");
		}
	});

	it("should fail username too big", () => {
		try {
			userFromBody.parse({ username: "a".repeat(101) });
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain("Nome de usuário deve ter no máximo");
		}
	});

	it("should fail password too small", () => {
		try {
			userFromBody.parse({ plainTextPassword: "ab" });
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain("Senha deve ter pelo menos");
		}
	});

	it("should fail password too big", () => {
		try {
			userFromBody.parse({ plainTextPassword: "ab".repeat(16) });
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain("Senha deve ter no máximo");
		}
	});

	it("should fail password should have at least one uppercase letter", () => {
		try {
			userFromBody.parse({
				plainTextPassword: "a2345678",
				username: "Does Not Matter",
			});
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain(
				"Senha deve conter pelo menos uma letra maiúscula."
			);
		}
	});

	it("should fail password if only numbers", () => {
		try {
			userFromBody.parse({
				plainTextPassword: "12345678",
				username: "Does Not Matter",
			});
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain(
				"Senha deve conter pelo menos uma letra maiúscula."
			);
		}
	});

	it("should fail password should have at least one number", () => {
		try {
			userFromBody.parse({
				plainTextPassword: "Abcdefgh",
				username: "Does Not Matter",
			});
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain("Senha deve conter pelo menos um número.");
		}
	});

	it("should work.", () => {
		try {
			userFromBody.parse({
				plainTextPassword: "A1cdefgh",
				username: "Whatever",
			});
		} catch (error) {
			const { message } = error as ZodError;

			expect(message).toContain("Senha deve conter pelo menos um número.");
		}
	});
});
