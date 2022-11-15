import type { FastifyInstance } from "fastify";

import { authenticate } from "../plugins/authenticate";
import { prisma } from "../prisma";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get("/user/me", { onRequest: [authenticate] }, async request => ({
		user: request.user,
	}));
}
