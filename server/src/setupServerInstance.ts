import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { transactionRoutes } from "./routes/transactions";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { jwtSecret } from "./env";

/** Create, setup and start server. */
export async function setupServerInstance() {
	// Create fastify instance:
	const fastifyInstance = Fastify({ logger: true });

	// Register plugins for cors and jwt:
	await fastifyInstance.register(jwt, { secret: jwtSecret });
	await fastifyInstance.register(cors, { origin: true });

	// Register all possible routes:
	await fastifyInstance.register(transactionRoutes);
	await fastifyInstance.register(userRoutes);
	await fastifyInstance.register(authRoutes);

	// We have to wait for everything to be ready,
	// otherwise tests won't work!
	await fastifyInstance.ready();

	return fastifyInstance;
}
