import type { FastifyInstance } from "fastify";

import { genSalt, hash, compare } from "bcrypt";
import { z } from "zod";

import { prisma } from "../prisma";

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Main function:

export async function authRoutes(fastify: FastifyInstance) {
	fastify.post("/api/auth/login", async req => {
		/** Todo usuário deverá conseguir logar na aplicação
		 * informando username e password. Caso o login seja
		 * bem-sucedido, um token JWT (com 24h de validade)
		 * deverá ser fornecido.
		 */

		// Get user input, validate it;
		// Get required fields from req.body, this will throw an error if it fails:
		const { username, plainTextPassword } = userFromBody.parse(req.body);

		try {
			// Find user:
			const user = await prisma.user.findUniqueOrThrow({
				select: { hashedPassword: true, id: true },
				where: { username },
			});

			// If a user is found, compare user password with hashed password stored in the database:
			const isPasswordValid = await compare(
				plainTextPassword,
				user.hashedPassword
			);

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
					sub: user.id, // subject
				}
			);

			return { token };
		} catch (error) {
			console.error("Error finding unique user at '/api/auth/login':", error);

			return { error: "User does not exist!" };
		}
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////

	fastify.post("/api/auth/create-user", async req => {
		/** Qualquer pessoa deverá poder fazer parte da NG.
		 * Para isso, basta realizar o cadastro informando
		 * `username` e `password`.
		 */
		// Get user input, validate it;
		// Get required fields from req.body, this will throw an error if it fails:
		const { username, plainTextPassword } = userFromBody.parse(req.body);

		try {
			const user = await prisma.user.create({
				data: {
					hashedPassword: await hashPassword(plainTextPassword),
					username,

					/** Durante o processo de cadastro de um novo usuário,
					 * sua respectiva conta deverá ser criada automaticamente
					 * na tabela Accounts com um balance de R$ 100,00.
					 * É importante ressaltar que caso ocorra algum problema
					 * e o usuário não seja criado, a tabela Accounts não
					 * deverá ser afetada.
					 */
					Account: {
						create: {
							balance: 100_000, // R$ 100,00 em centavos.
						},
					},
				},
			});

			// Return a token if successfull:
			const token = fastify.jwt.sign(
				{
					accountId: user.accountId,
					username,
				},
				{
					expiresIn: "24h",
					sub: user.id,
				}
			);

			return { token };
		} catch (error) {
			console.error("Error creating user at '/api/auth/create-user':", error);

			const isUsernameConstraintError = (error as Error).message.includes(
				usernameNotUniqueError
			);

			return {
				message: isUsernameConstraintError
					? usernameNotUniqueError
					: unableToCreateUserError,
			};
		}
	});
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Helper functions:

const hashPassword = async (plaintextPassword: string) =>
	await hash(plaintextPassword, await genSalt());

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Errors:

const usernameNotUniqueError =
	"Unique constraint failed on the fields: (`username`)";

const unableToCreateUserError = "Unable to create user at database!";

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Validation:

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
