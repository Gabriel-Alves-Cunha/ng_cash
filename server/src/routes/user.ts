import type { FastifyInstance } from "fastify";

import { authenticate } from "../plugins/authenticate";
import { prisma } from "../prisma";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get("/api/user/me", { onRequest: [authenticate] }, async req => {
		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: req.user.sub },
			});

			return { user };
		} catch (error) {
			console.error(
				"Error reading user's account at '/api/user/balance':",
				error
			);

			return { message: "Error reading user's account!" };
		}
	});

	fastify.get("/api/user/balance", { onRequest: [authenticate] }, async req => {
		/** Todo usuário logado (ou seja, que apresente um token válido)
		 * deverá ser capaz de visualizar seu próprio balance atual.
		 * Um usuário A não pode visualizar o balance de um usuário B,
		 * por exemplo.
		 */
		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: req.user.sub },
				select: { Account: true },
			});

			return { balance: user.Account.balance };
		} catch (error) {
			console.error("Error reading user's user at '/api/user/balance':", error);

			return { message: "Error reading user's account!" };
		}
	});
}
