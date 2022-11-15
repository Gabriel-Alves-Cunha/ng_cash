import "@fastify/jwt";

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			username: string;
			id: string;
		};
	}
}
