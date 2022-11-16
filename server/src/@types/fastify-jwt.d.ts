import "@fastify/jwt";

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			username: string;
			sub: string;
			iat: number;
			exp: number;
		};
	}
}
