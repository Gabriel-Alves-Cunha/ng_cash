import type { FastifyInstance } from "fastify";
import type { Account } from "@prisma/client";

import { authenticate } from "../plugins/authenticate";
import { prisma } from "../prisma";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get("/user/me", { onRequest: [authenticate] }, async req => ({
		user: req.user,
	}));

	fastify.get("/user/balance", { onRequest: [authenticate] }, async req => {
		/** Todo usuário logado (ou seja, que apresente um token válido)
		 * deverá ser capaz de visualizar seu próprio balance atual.
		 * Um usuário A não pode visualizar o balance de um usuário B,
		 * por exemplo.
		 */

		let account: Account | null = null;
		try {
			account = await prisma.account.findUniqueOrThrow({
				where: { id: req.user.id },
			});
		} catch (error) {
			console.error("Error reading user's account at '/user/balance':", error);

			return {
				message: "Error reading user's account!",
				error,
			};
		}

		return { balance: account.balance };
	});
}
