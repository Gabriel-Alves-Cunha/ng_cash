import type { FastifyInstance } from "fastify";

import { genSalt, hash, compare } from "bcrypt";

import { userFromBody } from "#validation/user";
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
				return { message: "Invalid password!" };

			// Return a token if successfull:
			const authToken = fastify.jwt.sign(
				{
					username,
				},
				{
					expiresIn: "24h",
					sub: user.id, // subject
				}
			);

			return { authToken };
		} catch (error) {
			console.error("Error finding unique user at '/api/auth/login':", error);

			return { message: "User does not exist!" };
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
			const authToken = fastify.jwt.sign(
				{
					accountId: user.accountId,
					username,
				},
				{
					expiresIn: "24h",
					sub: user.id,
				}
			);

			return { authToken };
		} catch (error) {
			console.error("Error creating user at '/api/auth/create-user':", error);

			const isUsernameConstraintError = (error as Error).message.includes(
				usernameNotUnique_Error
			);

			return {
				message: isUsernameConstraintError
					? usernameNotUnique_Error
					: unableToCreateUser_Error,
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

const usernameNotUnique_Error =
		"Unique constraint failed on the fields: (`username`)",
	unableToCreateUser_Error = "Unable to create user at database!";
