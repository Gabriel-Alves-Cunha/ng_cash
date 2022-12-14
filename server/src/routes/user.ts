import type { FastifyInstance } from "fastify";

import { authenticate } from "#plugins/authenticate";
import { prisma } from "../prisma";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get("/api/user/me", { onRequest: [authenticate] }, async req => {
		try {
			const user = await prisma.user.findUniqueOrThrow({
				select: { Account: true, username: true },
				where: { id: req.user.sub },
			});

			return { username: user.username, balance: user.Account.balance };
		} catch (error) {
			console.error(
				"Error reading user's account at '/api/user/balance':",
				error
			);

			return { message: "Error reading user's account!" };
		}
	});
}
