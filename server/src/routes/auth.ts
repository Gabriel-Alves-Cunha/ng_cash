import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

import { genSalt, hash, compare } from "bcrypt";
import { z } from "zod";

import { prisma } from "../prisma";

export async function authRoutes(fastify: FastifyInstance) {
	fastify.post("/auth/login", async req => {
		// Get user input, validate it;
		// Get required fields from req.body, this will throw an error if it fails:
		const { username, plainTextPassword } = userFromBody.parse(req.body);

		console.error("authRoutes", { username, plainTextPassword });

		// Find user:
		const user = await prisma.user.findUnique({
			select: { hashedPassword: true, id: true },
			where: { username },
		});

		console.error("authRoutes.user", user);

		if (!user) return { error: "User does not exist!" };

		// If a user is found, compare user password with hashed password stored in the database:
		const isPasswordValid = await compare(
			plainTextPassword,
			user.hashedPassword
		);

		console.error("authRoutes", { isPasswordValid });

		if (!isPasswordValid)
			// Reject user login:
			return { error: "Invalid password!" };

		// Return a token if successfull:
		const token = fastify.jwt.sign(
			{
				username,
			},
			{
				expiresIn: "24h",
				sub: user.id,
			}
		);

		console.error("authRoutes.token", token);

		return { token };
	});

	fastify.post("/auth/create-user", async req => {
		/** Qualquer pessoa deverá poder fazer parte da NG.
		 * Para isso, basta realizar o cadastro informando
		 * `username` e `password`.
		 */
		// Get user input, validate it;
		// Get required fields from req.body, this will throw an error if it fails:
		const { username, plainTextPassword } = userFromBody.parse(req.body);
		const hashedPassword = await hashPassword(plainTextPassword);

		let prismaErrorCreatingUser = null;
		const user = await prisma.user
			.create({
				data: {
					hashedPassword,
					username,

					Account: {
						create: {
							balance: 100_000, // R$ 100,00 em centavos.
						},
					},
				},
			})
			.catch(err => {
				prismaErrorCreatingUser = err as Error;
				console.error(err);
				return null;
			});

		console.error("authRoutes", { user, prismaErrorCreatingUser });

		if (!user)
			return {
				message: "Unable to create user at database!",
				error: prismaErrorCreatingUser,
			};

		// Return a token if successfull:
		const token = fastify.jwt.sign(
			{
				username,
			},
			{
				expiresIn: "24h",
				sub: user.id,
			}
		);

		return { token };
	});
}

async function hashPassword(plaintextPassword: string) {
	return await hash(plaintextPassword, await genSalt());
}

const numbers = /[0-9]/g;

export const userFromBody = z.object({
	/** Deve-se garantir que cada username seja único
	 * e composto por, pelo menos, 3 caracteres.
	 */
	username: z
		.string()
		.min(3, "Nome deve conter pelo menos 3 caracteres.")
		.max(100, "Nome deve conter no máximo 100 caracteres."),
	/** Deve-se garantir que a password seja composta por
	 * pelo menos 8 caracteres, um número e uma letra
	 * maiúscula. Lembre-se que ela deverá ser hashada
	 * ao ser armazenada no banco.
	 */
	plainTextPassword: z
		.string()
		.min(8, "Senha deve conter pelo menos 8 caracteres.")
		.max(30, "Senha deve conter no máximo 30 caracteres.")
		.refine(str => {
			let isAtLeastOneCharUppercase = false;

			for (const char of str)
				if (char === char.toUpperCase() && !char.match(numbers)) {
					isAtLeastOneCharUppercase = true;
					break;
				}

			return isAtLeastOneCharUppercase;
		}, "Senha deve conter pelo menos uma letra maiúscula.")
		.refine(str => {
			const isAtLeastOneCharANumber = (str.match(numbers) ?? []).length > 0;

			return isAtLeastOneCharANumber;
		}, "Senha deve conter pelo menos um número."),
});
