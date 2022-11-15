import type { FastifyInstance } from "fastify";

import { authenticate } from "../plugins/authenticate";
import { prisma } from "../prisma";

export async function transactionRoutes(fastify: FastifyInstance) {
	fastify.get("/transactions", { onRequest: [authenticate] }, async () => {});
}
